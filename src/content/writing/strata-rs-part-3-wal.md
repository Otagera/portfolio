---
title: "Write-Ahead Logs and Crash Recovery"
date: "2026-09-12"
readTime: "5 min"
summary: "Why the WAL has to be fsync'd before the write is acknowledged, and how replaying it on startup rebuilds the MemTable after a crash."
tags: ["rust", "database", "strata-db", "placeholder"]
draft: true
spinoffOf:
  seriesId: "strata-rs-rewrite"
  part: 3
  label: "WAL & Recovery"
---

_Outline placeholder for a future post in this series — not written yet. Kept as a roadmap for what comes next, not meant to be deleted._

Why the WAL has to be fsync'd before the write is acknowledged, and how replaying it on startup rebuilds the MemTable after a crash.
