---
title: "StrataDB: Engineering a Multi-Layered Database from Scratch"
date: "2026-02-17"
updatedDate: "2026-02-17"
readTime: "5 min"
summary: "A technical post-mortem on building a multi-layered relational engine, from byte-level storage to SQL interfaces and ACID transactions."
tags: ["database", "systems", "typescript", "sql"]
---

# StrataDB: Engineering a Multi-Layered Database from Scratch

Building a database is the ultimate exercise in systems engineering. I came across [Build Your Own Database](https://www.nan.fyi/database) that explains Key-Value DBs and I started learning with Gemini and the whole thing was demystified. In the process, we built **StrataDB**—a system that starts at the byte level and climbs all the way up to a Relational SQL interface. This post documents the architecture, the "Aha!" moments, and the engineering trade-offs made along the way. It is a constant battle against the limitations of hardware, the unpredictability of crashes, and the inevitable complexity of abstraction. We didn't build **StrataDB** by following a rigid specification; we built it by hitting walls and refactoring our way through them.

This is a technical post-mortem of the journey from a naive file-writer to a multi-layered relational engine with ACID aspirations.

---

## 0. The First Primitive: File I/O
It’s easy to think of databases as black boxes, but at their core, they are just programs that manage files. Before we built complex layers, we had to master the two most basic operations in the Node.js `fs` module: **Appending** and **Seeking**.

```typescript
import { appendFile, open } from 'node:fs/promises';

// 1. The Write: Append-only is the fastest write possible
await appendFile('db.log', `${key}:${value}\n`);

// 2. The Read: Seeking to a specific byte instead of scanning
const file = await open('db.log', 'r');
const buffer = Buffer.alloc(1024);
await file.read(buffer, 0, 1024, byteOffset);
```

The entire project is essentially an exercise in making these two operations work together at scale. The goal is to write data as fast as `appendFile` allows, but read it as if we were jumping directly to a specific line.

---

## 1. The Storage Evolution: From Flat Files to LSM-Trees
The project started with the most basic primitive: appending data to a file. It’s the fastest way to write, but the slowest way to read. Once your dataset exceeds a few megabytes, scanning the entire file for a single key becomes an $O(N)$ bottleneck.

The first major pivot was moving to a **Log-Structured Merge-tree (LSM-tree)**. Instead of updating files in place or creating one file per key—which quickly leads to **File Descriptor exhaustion**—we began buffering writes in an in-memory **MemTable**. When the buffer fills, it’s flushed to disk as an immutable **SSTable** (Sorted String Table).

### The Flush Lifecycle
```text
[ MEMORY ]                      [ DISK ]
MemTable (Mutable)              SSTables (Immutable)
+--------------+                +-------------------------+
| key: "a"     |                | sst_1.sst               |
| key: "b"     | -- Flush -->   | [Block 1: a, b, c...]   |
| key: "c"     |                | [Sparse Index]          |
+--------------+                +-------------------------+
```

```typescript
// The core of the LSM-Tree: Sparse Indexing
export interface BlockIndex {
    key: string;   // The first key in a 1KB block
    offset: number; // The byte offset in the .sst file
}
```
*By maintaining a sparse index of block offsets in RAM, we can jump to the exact vicinity of a key on disk, performing a tiny sequential scan instead of a full-file search.*

---

## 2. Bridging the Gap: Persistence vs. Durability
A database that loses data on a crash isn't a database; it’s a cache. Because the MemTable lives in RAM, any write that hasn't been flushed to an SSTable is volatile. If the process dies, that data is gone.

This highlighted the critical gap between **Persistence** (eventually writing to disk) and **Durability** (guaranteeing the data survives a crash). To solve this, we implemented a **Write-Ahead Log (WAL)**. 

### Sequence of a Write
1. **Append to WAL:** `{"op": "PUT", "k": "id", "v": "1"}` is synced to disk.
2. **Update MemTable:** Key `"id"` is updated in RAM.
3. **Acknowledge:** Return "Success" to the user.

*If the system crashes at Step 2, the WAL is replayed on restart to restore the MemTable.*

*   **The Log Format:** We initially used a simple colon-delimited format, but eventually migrated to **JSON Lines** to handle multi-operation transactions with better observability.

```json
{"txId": "uuid-1", "op": "BEGIN"}
{"txId": "uuid-1", "op": "PUT", "key": "user:123", "value": "{...}"}
{"txId": "uuid-1", "op": "COMMIT"}
```

---

## 3. Abstraction Layers: Moving to Documents
With a stable Key-Value engine as our foundation, we moved up the stack to build **StrataDoc**. Most NoSQL databases (like MongoDB) are essentially sophisticated wrappers around a KV store. The "magic" of indexing turned out to be quite literal: **Secondary Indexes** are just shadow data stored in the KV engine. 

To index an email field, we write a second KV entry where the key is a composite string of the field and value, and the value points back to the primary document ID.

### Shadow Data in the KV Store
```text
[ PRIMARY DATA ]
Key: "user:101"
Val: "{"id": 101, "email": "neo@matrix.org"}"

[ SECONDARY INDEX ]
Key: "IDX::users::email::neo@matrix.org::101"
Val: ""  <-- The key contains everything we need
```

*   **The Query Cursor:** To handle large collections without crashing the runtime, we avoided returning massive arrays. Instead, we implemented **Async Query Cursors** using TypeScript Async Generators to stream documents from disk one by one.

```typescript
// Secondary Indexing: The key IS the index
const indexKey = `IDX::${collection}::${field}::${value}::${id}`;
await this.kv.database_set(indexKey, ""); 
```

---

## 4. The SQL Layer: Adding Guardrails
Flexibility is a double-edged sword. While document stores are easy to start with, they lack the structural guarantees required for complex relational data. We built **StrataSQL** to enforce "Clean Data" via a formal compiler pipeline: **Lexer -> Parser -> Executor**.

This shift from "Schema-less" to "Schema-Enforced" introduced two new challenges:
*   **System Catalog:** A "metadatabase" that stores table definitions, mapping column names to types. 
*   **Type Enforcement:** SQL ensures you can't put a string into an `INT` column, even though the underlying KV layer still treats everything as a string.

---

## 5. The ACID Frontier: Atomicity & Isolation
The current phase of the project is the move from individual writes to **Atomic Transactions**. To support this, we had to rethink the Write-Ahead Log. We migrated from a flat KV log to a **JSON Lines** format that can track transaction boundaries (`BEGIN`, `COMMIT`, `ROLLBACK`). While less dense than binary, the ability to `tail -f wal.log` during debugging provides invaluable observability.

*   **Isolation via Staging Buffers:** To prevent "Dirty Reads," we implemented a private workspace for each transaction. Writes live in a `Map` buffer and are only merged into the global MemTable upon a successful commit.
*   **Dependency Inversion:** As the system grew, we hit circular dependencies (e.g., the Engine needing the Transaction class and vice-versa). We solved this by introducing the `IKVStorageEngine` interface, decoupling the core storage logic from the transaction manager.

```typescript
export interface IKVStorageEngine {
    database_get(key: string): Promise<string | null>;
    commitBatch(batch: WALBatch): Promise<void>;
    _get_db_sentinel_value(): string;
}
```

---

## 6. The Current State: The Unified CLI
StrataDB now exposes a unified interface that allows interacting with all three layers simultaneously.

### Example: Relational Transaction
```sql
> BEGIN;
> CREATE TABLE users (id INT, name TEXT, active BOOL);
> INSERT INTO users {"id": 1, "name": "Neo", "active": true};
> SELECT * FROM users WHERE id = 1;
# Result: [{ id: 1, name: "Neo", active: true }]
> COMMIT;
```

### Example: Document Indexing
```bash
> INDEX users email
> INSERT users {"email": "morpheus@nebuchadnezzar.io", "rank": "Captain"}
> FIND users {"email": "morpheus@nebuchadnezzar.io"}
```

### Example: Raw KV Access
```bash
> KV:SET system:status "online"
> KV:GET system:status
# Result: "online"
```

---

## 7. Retrospective: Engineering Trade-offs

| Component | Recommended Decision | Trade-off |
| :--- | :--- | :--- |
| **Storage Engine** | LSM-Tree | Optimized for write throughput; requires complex background Compaction. |
| **Log Format** | JSON Lines | Prioritizes human-readability and debuggability over binary density. |
| **Isolation** | Staging Buffer | Simple implementation of Snapshot Isolation; RAM usage scales with transaction size. |
| **Relational** | AST-based Parser | Extensible and robust; slower than Regex but required for complex WHERE logic. |

**The Journey Ahead:** We are currently moving toward **MVCC (Multi-Version Concurrency Control)**, allowing readers to see a consistent snapshot of the past while writers build the future—all without the performance penalty of global locks. Also I am aware that most relational databases use B-Tree instead of LSM so I will explore that if I can. And at some point I will be rewriting ths in Rust because I am currently learning rust. This project will be perfect to tackle in Rust to open my mind up all the more to Rust-lang.

---

*Through StrataDB, I came to appreciate that databases are masterclasses in layering. They proved to me that while databases are complex, they aren't magic—just layers of clever logic stacked on top of bytes. It’s an oversimplification, but it’s a powerful one.*
