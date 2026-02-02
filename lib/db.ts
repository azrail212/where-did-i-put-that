// lib/db.ts
import * as SQLite from "expo-sqlite";

/**
 * Single DB instance (kept in memory once opened)
 */
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Current schema version of your app database.
 * Increment this when you change tables/columns.
 */
const SCHEMA_VERSION = 1;

/**
 * Open (or reuse) the SQLite DB file on the device.
 * This creates a file like: where-did-i-put-that.db (on the phone).
 */
export async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("where-did-i-put-that.db");
  return db;
}

/**
 * Initialize DB: set pragmas + run migrations.
 * Call this once on app start (e.g. in app/_layout.tsx).
 */
export async function initDb() {
  const database = await getDb();

  // Pragmas (safe defaults)
  // WAL improves concurrency and is common for apps.
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  // Read existing schema version
  const row = await database.getFirstAsync<{ user_version: number }>(
    `PRAGMA user_version;`,
  );
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion >= SCHEMA_VERSION) {
    return; // already up to date
  }

  // Run migrations step-by-step
  await database.execAsync("BEGIN TRANSACTION;");
  try {
    if (currentVersion < 1) {
      // v1 schema
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          location TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );
      `);
    }

    // Update schema version
    await database.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
    await database.execAsync("COMMIT;");
  } catch (e) {
    await database.execAsync("ROLLBACK;");
    throw e;
  }
}

/**
 * Helper: run a SQL statement (INSERT/UPDATE/DELETE)
 */
export async function run(sql: string, params: SQLite.SQLiteBindValue[] = []) {
  const database = await getDb();
  return database.runAsync(sql, params);
}

/**
 * Helper: get all rows from a SELECT
 */
export async function getAll<T>(
  sql: string,
  params: SQLite.SQLiteBindValue[] = [],
): Promise<T[]> {
  const database = await getDb();
  return database.getAllAsync<T>(sql, params);
}

/**
 * Helper: get the first row (or null) from a SELECT
 */
export async function getFirst<T>(
  sql: string,
  params: SQLite.SQLiteBindValue[] = [],
): Promise<T | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<T>(sql, params);
  return row ?? null;
}
