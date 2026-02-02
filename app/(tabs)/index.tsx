import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { listItems, type Item } from "@/lib/itemsRepo";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setErrorMsg(null);
      setLoading(true);
      const data = await listItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not load items.");
    } finally {
      setLoading(false);
    }
  }, []);

  // First load
  useEffect(() => {
    load();
  }, [load]);

  // Reload when user returns to Home tab (after adding/editing later)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <ScrollView>
      <ScreenHeader screenName="Where Did I Put That?" />
      <View className="flex-1 bg-app-bg px-4 pt-4">
        <View className="bg-app-card border border-app-border rounded-card px-4 py-3 flex-row items-center mb-4">
          <Icon name="search" size={16} color="#64748B" />
          <TextInput
            placeholder="Search items or locations..."
            className="ml-3 flex-1 text-app-text"
            placeholderTextColor="#64748B"
          />
        </View>

        {loading && <Text className="text-app-muted">Loading…</Text>}

        {!loading && errorMsg && (
          <Text className="text-app-muted">{errorMsg}</Text>
        )}

        {!loading && !errorMsg && items.length === 0 && (
          <Text className="text-app-muted">
            No items yet. Tap + to add your first one.
          </Text>
        )}
        {!loading &&
          !errorMsg &&
          items.map((it) => (
            <ItemCard
              key={it.id}
              title={it.name}
              location={it.location}
              datetime={it.createdAt}
            />
          ))}
      </View>
    </ScrollView>
  );
}
