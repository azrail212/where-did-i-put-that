import CustomButton from "@/components/CustomButton";
import ScreenHeader from "@/components/ScreenHeader";
import { getItemById, updateItem } from "@/lib/itemsRepo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function EditItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const item = await getItemById(id);
      if (item) {
        setName(item.name);
        setLocation(item.location);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-app-bg">
        <ScreenHeader screenName="Edit Item" backButton />
        <View className="px-4 pt-6">
          <Text className="text-app-muted">Loading…</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      <ScreenHeader screenName="Edit Item" backButton />

      <View className="px-4 pt-6">
        <Text className="text-app-text font-medium mb-2">Item name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Item name"
          placeholderTextColor="#64748B"
          className="bg-app-card border border-app-border rounded-card p-4 text-app-text mb-5"
        />

        <Text className="text-app-text font-medium mb-2">Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Where did you put it?"
          placeholderTextColor="#64748B"
          className="bg-app-card border border-app-border rounded-card p-4 text-app-text mb-8"
        />

        <CustomButton
          text="Save Changes"
          onPress={async () => {
            await updateItem(id, { name, location });
            router.back();
          }}
          iconName="save"
          disabled={name.trim() === "" || location.trim() === ""}
        />
      </View>
    </View>
  );
}
