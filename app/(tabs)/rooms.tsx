import { ROOM_ICON_OPTIONS } from "@/lib/roomIconOptions";

import ScreenHeader from "@/components/ScreenHeader";
import {
  createRoom,
  listRoomsWithCounts,
  type Room,
  type RoomWithCount
} from "@/lib/roomsRepo";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
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
  const [selectedIcon, setSelectedIcon] = useState("home");

  const loadRooms = useCallback(async () => {
    const enriched = await listRoomsWithCounts();
    setRooms(enriched);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms]),
  );

  async function handleCreateRoom() {
    if (!newRoomName.trim()) return;

    await createRoom(newRoomName.trim(), "", selectedIcon);
    setNewRoomName("");
    setSelectedIcon(selectedIcon);

    setModalVisible(false);
    loadRooms();
  }

  function renderRoom({ item }: { item: RoomWithCount }) {
    return (
      <View className="bg-app-card border border-app-border rounded-card p-4 mb-4 flex-row items-start">
        {/* Left Icon */}
        <View className="w-12 h-12 rounded-xl bg-app-surface border border-app-border items-center justify-center mr-4">
          <Icon
            name={(item.icon || "home-outline") as any}
            size={22}
            color="#4F8A8B"
          />
        </View>

        {/* Main Content */}
        <View className="flex-1">
          <Text
            className="text-app-text font-semibold text-base"
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text className="text-app-muted mt-1">{item.itemCount} items</Text>
        </View>

        {/* Actions */}
        <View className="flex-row items-center ml-3">
          <Pressable
            hitSlop={20}
            className="w-10 h-10 items-center justify-center"
          >
            <Icon name="create-outline" size={20} color="#4F8A8B" />
          </Pressable>

          <Pressable
            hitSlop={20}
            className="w-10 h-10 items-center justify-center ml-2"
          >
            <Icon name="trash-outline" size={20} color="#64748B" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      <ScreenHeader screenName="Rooms" showLogo />

      {/* Add Button in Header Area */}
      <View className="absolute right-4 top-14">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            position: "absolute",
            top: 10,
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
          <Icon name="add" size={36} color="white" />
        </TouchableOpacity>
      </View>

      {rooms.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-app-card border border-app-border rounded-card p-6 w-full items-center">
            <Icon name="folder-open-outline" size={40} color="#94A3B8" />

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
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderRoom}
        />
      )}

      {/* Modal */}
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
            <Text className="text-app-text font-medium mb-3">Choose Icon</Text>

            <View className="flex-row flex-wrap justify-between mb-6">
              {ROOM_ICON_OPTIONS.map((icon) => {
                const selected = icon === selectedIcon;

                return (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    className={`w-[22%] aspect-square mb-3 rounded-xl items-center justify-center ${
                      selected
                        ? "bg-app-accent"
                        : "bg-app-surface border border-app-border"
                    }`}
                  >
                    <Icon
                      name={icon as any}
                      size={24}
                      color={selected ? "white" : "#64748B"}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

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
