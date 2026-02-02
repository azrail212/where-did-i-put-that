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

/**
 * TEMPORARY: Seed demo items for UI testing.
 * This should be removed once Add Item flow is ready.
 */
export async function seedDemoItems() {
  // Check if there are already items
  const existing = await getAll<Item>("SELECT id FROM items LIMIT 1;");
  if (existing.length > 0) {
    return; // already seeded
  }

  const now = new Date();

  const demoItems = [
    {
      name: "Christmas decorations",
      location: "Garage · black box · top shelf",
    },
    {
      name: "Spare phone charger",
      location: "Kitchen drawer · left side",
    },
    {
      name: "Kids documents",
      location: "Bedroom closet · blue folderr",
    },
    {
      name: "Tool set",
      location: "Hallway cabinet · small box",
    },
  ];

  for (let i = 0; i < demoItems.length; i++) {
    const createdAt = new Date(now.getTime() - i * 60_000).toISOString();

    await run(
      `
      INSERT INTO items (id, name, location, createdAt)
      VALUES (?, ?, ?, ?);
      `,
      [randomUUID(), demoItems[i].name, demoItems[i].location, createdAt],
    );
  }
}

export async function createItem(name: string, location: string) {
  // TODO: insert item into DB
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
