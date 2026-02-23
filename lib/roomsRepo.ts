// lib/roomsRepo.ts
import { randomUUID } from "expo-crypto";
import { getAll, getFirst, run } from "./db";

/**
 * Domain model for a room.
 * Each room contains a string of places.
 */
export type Room = {
  id: string;
  name: string;
  places: string; // simple comma-separated string for now
  createdAt: string;
};

/**
 * Fetch all rooms.
 * Sorted by newest first (consistent with items).
 */
export async function listRooms(): Promise<Room[]> {
  const sql = `
    SELECT
      id,
      name,
      places,
      createdAt
    FROM rooms
    ORDER BY datetime(createdAt) DESC;
  `;

  return getAll<Room>(sql);
}

export async function createRoom(name: string, places: string) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await run(
    `
    INSERT INTO rooms (id, name, places, createdAt)
    VALUES (?, ?, ?, ?);
    `,
    [id, name, places, createdAt],
  );
}

export async function updateRoom(
  id: string,
  updates: {
    name?: string;
    places?: string;
  },
) {
  await run(
    `
    UPDATE rooms
    SET name = ?,
        places = ?
    WHERE id = ?;
    `,
    [updates.name ?? "", updates.places ?? "", id],
  );
}

export async function getRoomById(id: string) {
  return getFirst<Room>(
    `
    SELECT id, name, places, createdAt
    FROM rooms
    WHERE id = ?
    LIMIT 1;
    `,
    [id],
  );
}

export async function deleteRoom(id: string) {
  await run(
    `
    DELETE FROM rooms
    WHERE id = ?;
    `,
    [id],
  );
}

export async function restoreRoom(room: Room) {
  await run(
    `
    INSERT INTO rooms (id, name, places, createdAt)
    VALUES (?, ?, ?, ?);
    `,
    [room.id, room.name, room.places, room.createdAt],
  );
}
