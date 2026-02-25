// lib/db.ts
import { randomUUID } from "expo-crypto";
import * as SQLite from "expo-sqlite";
import { DEFAULT_ROOMS } from "./defaultRooms";
/**
 * Single DB instance (kept in memory once opened)
 */
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Current schema version of your app database.
 * Increment this when you change tables/columns.
 */
const SCHEMA_VERSION = 6;

/**
 * Open (or reuse) the SQLite DB file on the device.
 */
export async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("where-did-i-put-that.db");
  return db;
}

/**
 * Initialize DB: set pragmas + run migrations.
 */
export async function initDb() {
  const database = await getDb();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  const row = await database.getFirstAsync<{ user_version: number }>(
    `PRAGMA user_version;`,
  );
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion >= SCHEMA_VERSION) {
    return;
  }

  await database.execAsync("BEGIN TRANSACTION;");
  try {
    /**
     * v1 — initial items table
     */
    if (currentVersion < 1) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          location TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );
      `);
    }

    /**
     * v2 — ensure location column exists
     */
    if (currentVersion < 2) {
      const cols = await database.getAllAsync<{ name: string }>(
        `PRAGMA table_info(items);`,
      );
      const hasLocation = cols.some((c) => c.name === "location");
      if (!hasLocation) {
        await database.execAsync(
          `ALTER TABLE items ADD COLUMN location TEXT NOT NULL DEFAULT '';`,
        );
      }
    }

    /**
     * v3 — rooms table
     */
    if (currentVersion < 3) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS rooms (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          places TEXT NOT NULL DEFAULT '',
          icon TEXT NOT NULL DEFAULT 'home',
          createdAt TEXT NOT NULL
        );
      `);

      // Seed default rooms on first creation only
      for (const room of DEFAULT_ROOMS) {
        await database.runAsync(
          `
    INSERT INTO rooms (id, name, places, icon, createdAt)
    VALUES (?, ?, '', ?, ?);
    `,
          [randomUUID(), room.name, room.icon, new Date().toISOString()],
        );
      }
    }

    /**
     * v4 — link items to rooms
     */
    if (currentVersion < 4) {
      const cols = await database.getAllAsync<{ name: string }>(
        `PRAGMA table_info(items);`,
      );

      const hasRoomId = cols.some((c) => c.name === "roomId");

      if (!hasRoomId) {
        await database.execAsync(`
      ALTER TABLE items 
      ADD COLUMN roomId TEXT 
      REFERENCES rooms(id) 
      ON DELETE SET NULL;
    `);
      }
    }

    if (currentVersion < 5) {
      const cols = await database.getAllAsync<{ name: string }>(
        `PRAGMA table_info(items);`,
      );

      const hasCategory = cols.some((c) => c.name === "category");

      if (!hasCategory) {
        await database.execAsync(
          `ALTER TABLE items ADD COLUMN category TEXT NOT NULL DEFAULT 'Miscellaneous';`,
        );
      }
    }

    /**
     * v6 — add icon column to rooms (default 'home')
     */
    if (currentVersion < 6) {
      const cols = await database.getAllAsync<{ name: string }>(
        `PRAGMA table_info(rooms);`,
      );

      const hasIcon = cols.some((c) => c.name === "icon");

      if (!hasIcon) {
        await database.execAsync(
          `ALTER TABLE rooms ADD COLUMN icon TEXT NOT NULL DEFAULT 'home';`,
        );
      }
    }

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
 * Helper: get the first row (or null)
 */
export async function getFirst<T>(
  sql: string,
  params: SQLite.SQLiteBindValue[] = [],
): Promise<T | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<T>(sql, params);
  return row ?? null;
}

/**
 * Development helper: drop and recreate DB schema.
 */
export async function resetDb() {
  const database = await getDb();

  await database.execAsync("BEGIN TRANSACTION;");
  try {
    await database.execAsync(`DROP TABLE IF EXISTS items;`);
    await database.execAsync(`DROP TABLE IF EXISTS rooms;`);

    await database.execAsync(`PRAGMA user_version = 0;`);

    await database.execAsync("COMMIT;");
  } catch (e) {
    await database.execAsync("ROLLBACK;");
    throw e;
  }

  db = null;

  await initDb();
}
