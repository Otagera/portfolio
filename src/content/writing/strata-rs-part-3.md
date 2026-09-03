---
title: "Rewriting StrataDB in Rust, Part 3: Compaction and the Write-Ahead Log"
date: "2026-09-10"
readTime: "7 min"
summary: "K-way merge compaction to keep SSTables from piling up forever, and a Write-Ahead Log so a crash doesn't lose whatever was still in the MemTable."
tags: ["rust", "database", "systems", "strata-db", "placeholder"]
draft: true
series:
  id: "strata-rs-rewrite"
  title: "Strata DB — Rust Rewrite"
  part: 3
  blurb: "Compaction and the WAL"
---

_Outline placeholder for a future post in this series — not written yet. Kept as a roadmap for what comes next, not meant to be deleted._

K-way merge compaction to keep SSTables from piling up forever, and a Write-Ahead Log so a crash doesn't lose whatever was still in the MemTable.
