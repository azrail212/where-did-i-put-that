import CustomButton from "@/components/CustomButton";
import ScreenHeader from "@/components/ScreenHeader";
import { createItem } from "@/lib/itemsRepo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

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
        <CustomButton
          text="Save Item"
          onPress={onSave}
          iconName="save"
          disabled={name.trim() === "" || location.trim() === ""}
        />
      </View>
    </ScrollView>
  );
}
