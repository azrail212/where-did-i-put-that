import ScreenHeader from "@/components/ScreenHeader";
import { getAll } from "@/lib/db";
import { createRoom, listRooms, type Room } from "@/lib/roomsRepo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type RoomWithCount = Room & { itemCount: number };

export default function RoomsScreen() {
  const [rooms, setRooms] = useState<RoomWithCount[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const loadRooms = useCallback(async () => {
    const baseRooms = await listRooms();
    const enriched: RoomWithCount[] = [];

    for (const room of baseRooms) {
      const count = await getAll<{ count: number }>(
        `SELECT COUNT(*) as count FROM items WHERE roomId = ?;`,
        [room.id],
      );

      enriched.push({
        ...room,
        itemCount: count[0]?.count ?? 0,
      });
    }

    setRooms(enriched);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms]),
  );

  async function handleCreateRoom() {
    if (!newRoomName.trim()) return;

    await createRoom(newRoomName.trim(), "");
    setNewRoomName("");
    setModalVisible(false);
    loadRooms();
  }

  function renderRoom({ item }: { item: RoomWithCount }) {
    return (
      <TouchableOpacity className="bg-app-card border border-app-border rounded-card p-4 mb-4">
        <Text className="text-app-text text-lg font-semibold">{item.name}</Text>
        <Text className="text-app-muted mt-1">{item.itemCount} items</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      <ScreenHeader screenName="Rooms" showLogo />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          width: 46,
          height: 46,
          borderRadius: 6,
          backgroundColor: "#4F8A8B",
          alignItems: "center",
          justifyContent: "center",
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>

      {rooms.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-app-card border border-app-border rounded-card p-6 w-full items-center">
            <Ionicons name="folder-open-outline" size={40} color="#94A3B8" />

            <Text className="text-app-text text-lg font-semibold mt-4">
              Add your first room
            </Text>

            <Text className="text-app-muted text-center mt-2">
              Rooms help you organize where your items are stored.
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="mt-6 bg-app-accent px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">Create Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Room List */
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderRoom}
        />
      )}

      {/* Add Room Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center px-6">
          <View className="bg-app-card rounded-card p-6">
            <Text className="text-app-text text-lg font-semibold mb-4">
              Create Room
            </Text>

            <TextInput
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="E.g., Kitchen, Bedroom..."
              className="bg-app-bg border border-app-border rounded-card p-4 mb-6 text-app-text"
            />

            <TouchableOpacity
              onPress={handleCreateRoom}
              disabled={newRoomName.trim() === ""}
              className="bg-app-accent p-4 rounded-full items-center"
            >
              <Text className="text-white font-semibold">Create Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-3 items-center"
            >
              <Text className="text-app-muted">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
