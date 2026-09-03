---
title: "Rewriting StrataDB in Rust, Part 2: SSTables and Bloom Filters"
date: "2026-09-06"
readTime: "6 min"
summary: "Flushing the MemTable to immutable SSTables, and adding a Bloom filter so reads for missing keys don't have to touch disk at all."
tags: ["rust", "database", "systems", "strata-db", "placeholder"]
draft: true
series:
  id: "strata-rs-rewrite"
  title: "Strata DB — Rust Rewrite"
  part: 2
  blurb: "SSTables and Bloom filters"
---

_Outline placeholder for a future post in this series — not written yet. Kept as a roadmap for what comes next, not meant to be deleted._

Flushing the MemTable to immutable SSTables, and adding a Bloom filter so reads for missing keys don't have to touch disk at all.
