import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { listItems, type Item } from "@/lib/itemsRepo";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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

  const filteredItems = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    return (
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  return (
    <ScrollView>
      <ScreenHeader screenName="Where Did I Put That?" />
      <View className="flex-1 bg-app-bg px-4 pt-4 pb-28">
        <View className="bg-app-card border border-app-border rounded-card p-4 mb-6 text-app-text flex-row items-center">
          <Icon name="search" size={18} color="#64748B" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search items or locations..."
            className="ml-3 flex-1 text-app-text"
            placeholderTextColor="#64748B"
          />
        </View>
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-full h-48 mb-4"
        />

        {loading && <Text className="text-app-muted">Loading…</Text>}

        {!loading && errorMsg && (
          <Text className="text-app-muted">{errorMsg}</Text>
        )}

        {!loading && !errorMsg && filteredItems.length === 0 && (
          <Text className="text-app-muted">
            Looks like the past you didn't care enough to keep track of any
            items under that search.
          </Text>
        )}
        {!loading &&
          !errorMsg &&
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              location={item.location}
              datetime={item.createdAt}
            />
          ))}
      </View>
    </ScrollView>
  );
}
