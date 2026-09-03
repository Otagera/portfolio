---
title: "Why fsync() Is Slower Than You Think"
date: "2026-09-13"
readTime: "4 min"
summary: "A detour into what fsync actually waits on at the OS and disk level, and why durability and throughput are directly in tension."
tags: ["rust", "systems", "strata-db", "placeholder"]
draft: true
spinoffOf:
  seriesId: "strata-rs-rewrite"
  part: 3
  label: "fsync() Internals"
---

_Outline placeholder for a future post in this series — not written yet. Kept as a roadmap for what comes next, not meant to be deleted._

A detour into what fsync actually waits on at the OS and disk level, and why durability and throughput are directly in tension.
