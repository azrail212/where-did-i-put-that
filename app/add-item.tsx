import { useEffect, useRef, useState } from "react";

import CategoryGrid from "@/components/CategoryGrid";
import CustomButton from "@/components/CustomButton";
import RoomGrid from "@/components/RoomGrid";
import ScreenHeader from "@/components/ScreenHeader";

import { createItem } from "@/lib/itemsRepo";
import { listRooms, type Room } from "@/lib/roomsRepo";

import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddItemScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [category, setCategory] = useState("Miscellaneous");

  const nameInputRef = useRef<TextInput>(null);
  const placeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    async function loadRooms() {
      const data = await listRooms();
      setRooms(data);
      if (data.length > 0) {
        setSelectedRoomId(data[0].id);
      }
    }

    loadRooms();

    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  async function onSave() {
    if (!selectedRoomId || !name.trim()) return;

    await createItem(name.trim(), place.trim(), category, selectedRoomId);

    router.back();
  }

  const canSave = name.trim() !== "" && selectedRoomId !== null;

  return (
    <View className="flex-1 bg-app-bg">
      <ScreenHeader screenName="Add Item" backButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          className="px-4 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          {/* Item Name */}
          <Text className="text-app-text font-semibold mb-2">Item Name</Text>

          <TextInput
            ref={nameInputRef}
            value={name}
            onChangeText={setName}
            placeholder="What is it?"
            blurOnSubmit={false}
            onSubmitEditing={() => placeInputRef.current?.focus()}
            className="bg-app-card border border-app-border rounded-card p-4 mb-5 text-app-text"
          />

          {/* Room Selection */}
          <Text className="text-app-text font-semibold mb-2">Room</Text>

          <RoomGrid
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelect={setSelectedRoomId}
          />

          {/* Category Selection */}
          <Text className="text-app-text font-semibold mt-2 mb-2">
            Category
          </Text>

          <CategoryGrid selectedCategory={category} onSelect={setCategory} />

          {/* Place */}
          <Text className="text-app-text font-semibold mb-2">
            Place (optional)
          </Text>

          <TextInput
            ref={placeInputRef}
            value={place}
            onChangeText={setPlace}
            placeholder="Shelf, drawer, box..."
            returnKeyType="done"
            onSubmitEditing={onSave}
            className="bg-app-card border border-app-border rounded-card p-4 mb-4 text-app-text"
          />
        </ScrollView>

        {/* Sticky Save Button */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-app-bg">
          <CustomButton
            text="Save Item"
            onPress={onSave}
            iconName="save"
            disabled={!canSave}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
