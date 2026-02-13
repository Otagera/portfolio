import { join } from 'node:path';
import Database from 'better-sqlite3';

// Store the DB in the root directory
const dbPath = join(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS post_views (
    slug TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  )
`);

export function getViews(slug) {
	const row = db.prepare('SELECT count FROM post_views WHERE slug = ?').get(slug);
	return row ? row.count : 0;
}

export function incrementViews(slug) {
	const info = db
		.prepare(`
    INSERT INTO post_views (slug, count) 
    VALUES (?, 1) 
    ON CONFLICT(slug) DO UPDATE SET count = count + 1
  `)
		.run(slug);
	return info.changes;
}

export function getAllViews() {
	const rows = db.prepare('SELECT * FROM post_views').all();
	return rows.reduce((acc, row) => {
		acc[row.slug] = row.count;
		return acc;
	}, {});
}

export default db;
