// lib/itemsRepo.ts
import { randomUUID } from "expo-crypto";
import { getAll, run } from "./db";

/**
 * Domain model for an item.
 * This matches both the DB schema and ItemCard props.
 */
export type Item = {
  id: string;
  name: string;
  location: string;
  createdAt: string;
};
/**
 * Fetch all items for the Home screen.
 * Sorted by newest first (default UX).
 */
export async function listItems(): Promise<Item[]> {
  const sql = `
    SELECT
      id,
      name,
      location,
      createdAt
    FROM items
    ORDER BY datetime(createdAt) DESC;
  `;

  return getAll<Item>(sql);
}

export async function createItem(name: string, location: string) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await run(
    `
      INSERT INTO items (id, name, location, createdAt)
      VALUES (?, ?, ?, ?);
      `,
    [id, name, location, createdAt],
  );
}

export async function updateItem(
  id: string,
  updates: {
    name?: string;
    location?: string;
  },
) {
  // TODO: update item
}

export async function deleteItem(id: string) {
  // TODO: delete item
}
