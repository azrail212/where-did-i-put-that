import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { deleteItem, listItems, type Item } from "@/lib/itemsRepo";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
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
    <View className="flex-1 bg-app-bg">
      <ScreenHeader screenName="Where Did I Put That?" showLogo />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <View>
            <View className="bg-app-card border border-app-border rounded-card p-4 mb-6 flex-row items-center">
              <Icon name="search" size={18} color="#64748B" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search items or locations..."
                className="ml-3 flex-1 text-app-text"
                placeholderTextColor="#64748B"
              />
            </View>

            {loading && <Text className="text-app-muted mb-3">Loading…</Text>}

            {!loading && errorMsg && (
              <Text className="text-app-muted mb-3">{errorMsg}</Text>
            )}

            {!loading && !errorMsg && filteredItems.length === 0 && (
              <Text className="text-app-muted mb-3">No items added yet.</Text>
            )}
          </View>
        }
        renderItem={({ item }) =>
          !loading && !errorMsg ? (
            <ItemCard
              id={item.id}
              title={item.name}
              location={item.location}
              datetime={item.createdAt}
              onEdit={(id) => {
                router.push(`../edit-item/${id}`);
                console.log("edit", id);
              }}
              onDelete={(id) => {
                Alert.alert(
                  "Delete item?",
                  "Are you sure you want to delete this item?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        await deleteItem(id);
                        load();
                      },
                    },
                  ],
                );
              }}
            />
          ) : null
        }
      />
    </View>
  );
}
