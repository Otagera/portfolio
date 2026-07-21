---
title: "Strata DB"
summary: "A multi-layered database engine built from scratch, from byte-level file I/O up through an LSM-tree key-value store, a document layer, and a relational SQL interface with ACID aspirations."
year: "2026"
tech: ["TypeScript", "Bun", "Node.js"]
link: "https://github.com/Otagera/strata-ts"
writeup: "/writing/engineering-stratadb"
---

StrataDB is an educational systems project that starts at the byte level and climbs all the way up to a relational SQL interface. It was built the way real systems get built: by hitting walls and refactoring through them, rather than following a rigid spec.

## The layers

- **Storage engine.** Began as append-only flat files (fast to write, O(N) to read), then pivoted to a **Log-Structured Merge-tree**: writes buffer in an in-memory MemTable and flush to immutable SSTables, with a sparse in-RAM block index so lookups jump to the right vicinity on disk instead of scanning.
- **Durability.** A **Write-Ahead Log** closes the gap between persistence and durability, replaying on restart to restore the MemTable after a crash. The log moved to JSON Lines to track transaction boundaries.
- **Document store (StrataDoc).** Secondary indexes are just shadow entries in the KV store (a composite key pointing back at the document id), and large collections stream through async query cursors built on TypeScript async generators.
- **SQL layer (StrataSQL).** A formal Lexer → Parser → Executor pipeline adds schema enforcement, a system catalog, and type checking on top of the schema-less core.

## The ACID frontier

The current work is atomic transactions: per-transaction staging buffers for isolation (no dirty reads), and an `IKVStorageEngine` interface introduced to break circular dependencies between the engine and the transaction manager. Next on the roadmap is MVCC, and eventually a Rust rewrite.

For the byte-level walkthrough, the flush lifecycle, and the full engineering trade-off table, read the deep dive linked above.
