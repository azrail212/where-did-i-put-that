import ScreenHeader from "@/components/ScreenHeader";
import { createItem } from "@/lib/itemsRepo";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function AddItemScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  async function onSave() {
    await createItem(name, location);
    setName("");
    setLocation("");
    router.back(); // back to home
  }

  return (
    <ScrollView>
      <ScreenHeader screenName="Add Item" backButton />

      <View className="flex-1 bg-app-bg px-4 pt-4">
        <Text className="text-app-text font-medium mb-2">Item Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="E.g., Winter Jacket, Laptop Charger..."
          className="bg-app-card border border-app-border rounded-card p-4 mb-6 text-app-text"
        />
        <Text className="text-app-text font-medium mb-2">Location</Text>

        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="E.g., Office Desk, Kitchen Shelf..."
          className="bg-app-card border border-app-border rounded-card p-4 mb-6 text-app-text"
        />
        <Pressable
          onPress={onSave}
          disabled={name.trim().length === 0 || location.trim().length === 0}
          className={`rounded-card py-4 items-center flex-row justify-center ${
            name.trim() === "" || location.trim() === ""
              ? "bg-app-accent/60"
              : "bg-app-accent"
          }`}
        >
          <Icon name="save" size={18} color="white" className="mr-2" />
          <Text className="text-white font-psemibold">Save Item</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
