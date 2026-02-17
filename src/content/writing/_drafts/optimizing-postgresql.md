---
title: "Optimizing PostgreSQL for high-concurrency"
date: "2026-02-08"
readTime: "5 min"
summary: "How we reduced lock contention by 60% using partitioning and fine-tuned vacuum settings."
tags: ["database", "postgresql", "performance"]
draft: true
---

# Optimizing PostgreSQL for high-concurrency

To improve performance, we implemented table partitioning. Here is an example of the optimized query structure:

```sql
CREATE TABLE orders (
    order_id INT NOT NULL,
    order_date DATE NOT NULL,
    customer_id INT,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (order_date);

-- Create a partition for 2026
CREATE TABLE orders_2026 PARTITION OF orders
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

This reduced our lock contention by nearly 60%.

