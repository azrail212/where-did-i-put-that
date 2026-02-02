import ItemCard from "@/components/ItemCard";
import { listItems, type Item } from "@/lib/itemsRepo";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

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
    <ScrollView className="bg-app-bg">
      <View className="flex-1 bg-app-bg px-4 pt-14">
        {/* Title */}
        <Text className="text-app-text text-2xl font-semibold mb-6">
          Where did I put that?
        </Text>

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
