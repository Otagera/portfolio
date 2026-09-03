---
title: "Tombstones: Modeling Deletes with Option<T>"
date: "2026-09-03"
readTime: "4 min"
summary: "A closer look at why StrataDB's Rust rewrite models deleted keys as Option<T> instead of a sentinel string, and what that buys a future multi-layer read path."
tags: ["rust", "database", "strata-db", "placeholder"]
draft: true
spinoffOf:
  seriesId: "strata-rs-rewrite"
  part: 1
  label: "Tombstones"
---

_Outline placeholder for a future post in this series — not written yet. Kept as a roadmap for what comes next, not meant to be deleted._

A closer look at why StrataDB's Rust rewrite models deleted keys as Option<T> instead of a sentinel string, and what that buys a future multi-layer read path.
