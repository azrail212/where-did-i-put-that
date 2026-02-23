// lib/itemsRepo.ts
import { randomUUID } from "expo-crypto";
import { getAll, getFirst, run } from "./db";

/**
 * Domain model for an item.
 */
export type Item = {
  id: string;
  name: string;
  location: string;
  category: string;
  roomId: string | null;
  createdAt: string;
};

/**
 * Fetch all items.
 */
export async function listItems(): Promise<Item[]> {
  const sql = `
    SELECT
      id,
      name,
      location,
      category,
      roomId,
      createdAt
    FROM items
    ORDER BY datetime(createdAt) DESC;
  `;

  return getAll<Item>(sql);
}

/**
 * Create item linked to a room with category.
 */
export async function createItem(
  name: string,
  location: string,
  category: string,
  roomId: string | null,
) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await run(
    `
      INSERT INTO items (id, name, location, category, roomId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    [id, name, location, category, roomId, createdAt],
  );
}

/**
 * Update item.
 */
export async function updateItem(
  id: string,
  updates: {
    name?: string;
    location?: string;
    category?: string;
    roomId?: string | null;
  },
) {
  await run(
    `
      UPDATE items
      SET name = ?,
          location = ?,
          category = ?,
          roomId = ?
      WHERE id = ?;
    `,
    [
      updates.name ?? "",
      updates.location ?? "",
      updates.category ?? "Miscellaneous",
      updates.roomId ?? null,
      id,
    ],
  );
}

/**
 * Get single item.
 */
export async function getItemById(id: string) {
  return getFirst<Item>(
    `
      SELECT id, name, location, category, roomId, createdAt
      FROM items
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );
}

/**
 * Delete item.
 */
export async function deleteItem(id: string) {
  await run(
    `
      DELETE FROM items
      WHERE id = ?;
    `,
    [id],
  );
}

/**
 * Restore item.
 */
export async function restoreItem(item: Item) {
  await run(
    `
      INSERT INTO items (id, name, location, category, roomId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    [
      item.id,
      item.name,
      item.location,
      item.category,
      item.roomId ?? null,
      item.createdAt,
    ],
  );
}
