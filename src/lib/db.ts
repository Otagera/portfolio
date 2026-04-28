import { join } from 'node:path';
import Database from 'better-sqlite3';

// Store the DB in the root directory
const dbPath = join(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

interface PostView {
  slug: string;
  count: number;
}

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS post_views (
    slug TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  )
`);

export function getViews(slug: string): number {
  const row = db.prepare('SELECT count FROM post_views WHERE slug = ?').get(slug) as { count: number } | undefined;
  return row ? row.count : 0;
}

export function incrementViews(slug: string): number {
  const info = db
    .prepare(`
    INSERT INTO post_views (slug, count) 
    VALUES (?, 1) 
    ON CONFLICT(slug) DO UPDATE SET count = count + 1
  `)
    .run(slug);
  return info.changes;
}

export function getAllViews(): Record<string, number> {
  const rows = db.prepare('SELECT * FROM post_views').all() as PostView[];
  return rows.reduce((acc, row) => {
    acc[row.slug] = row.count;
    return acc;
  }, {} as Record<string, number>);
}

export default db;
