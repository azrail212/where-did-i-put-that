import { type Room } from "@/lib/roomsRepo";
import { Ionicons as Icon } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (id: string) => void;
};

export default function RoomGrid({ rooms, selectedRoomId, onSelect }: Props) {
  return (
    <View className="flex-row flex-wrap justify-between mb-6">
      {rooms.map((room) => {
        const selected = room.id === selectedRoomId;

        return (
          <TouchableOpacity
            key={room.id}
            onPress={() => onSelect(room.id)}
            className={`w-[31%] mb-3 rounded-xl p-3 items-center ${
              selected
                ? "bg-app-accent"
                : "bg-app-card border border-app-border"
            }`}
          >
            <Icon
              name="home-outline"
              size={22}
              color={selected ? "white" : "#64748B"}
            />

            <Text
              numberOfLines={1}
              className={`mt-1 text-xs text-center ${
                selected ? "text-white" : "text-app-text"
              }`}
            >
              {room.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
