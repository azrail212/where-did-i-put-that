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
  icon: string;
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
      icon,
      places,
      createdAt
    FROM rooms
    ORDER BY datetime(createdAt) DESC;
  `;

  return getAll<Room>(sql);
}

export async function createRoom(name: string, places: string, icon?: string) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const iconValue = icon ?? "home-outline";

  await run(
    `
    INSERT INTO rooms (id, name, places, icon, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [id, name, places, iconValue, createdAt],
  );
}

export async function updateRoom(
  id: string,
  updates: {
    name?: string;
    places?: string;
    icon?: string;
  },
) {
  await run(
    `
    UPDATE rooms
    SET name = ?,
        places = ?,
        icon = ?
    WHERE id = ?;
    `,
    [
      updates.name ?? "",
      updates.places ?? "",
      updates.icon ?? "home-outline",
      id,
    ],
  );
}

export async function getRoomById(id: string) {
  return getFirst<Room>(
    `
    SELECT id, name, icon, places, createdAt
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
    INSERT INTO rooms (id, name, places, icon, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [room.id, room.name, room.places, room.icon ?? "home", room.createdAt],
  );
}

export type RoomWithCount = Room & { itemCount: number };

export async function listRoomsWithCounts(): Promise<RoomWithCount[]> {
  return getAll<RoomWithCount>(`
    SELECT
      r.id,
      r.name,
      r.places,
      r.icon,
      r.createdAt,
      COUNT(i.id) AS itemCount
    FROM rooms r
    LEFT JOIN items i ON i.roomId = r.id
    GROUP BY r.id
    ORDER BY r.createdAt DESC;
  `);
}
