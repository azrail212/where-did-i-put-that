import { Ionicons as Icon } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { deleteItem, listItems, type Item } from "@/lib/itemsRepo";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [undoItem, setUndoItem] = useState<Item | null>(null);
  const [undoSeconds, setUndoSeconds] = useState(5);

  // Timers
  const undoDeleteTimer = useRef<NodeJS.Timeout | null>(null);
  const undoCountdownTimer = useRef<NodeJS.Timeout | null>(null);

  /** Load items from DB */
  const loadItems = useCallback(async () => {
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

  // Reload on tab focus
  useFocusEffect(
    useCallback(() => {
      loadItems();
      return () => {
        if (undoDeleteTimer.current) clearTimeout(undoDeleteTimer.current);
        if (undoCountdownTimer.current)
          clearInterval(undoCountdownTimer.current);
      };
    }, [loadItems]),
  );

  /** Filtered items */
  const filteredItems = items.filter((item) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  /** Start 5s undo countdown */
  function startUndoCountdown(item: Item) {
    // clear existing timers
    if (undoDeleteTimer.current) clearTimeout(undoDeleteTimer.current);
    if (undoCountdownTimer.current) clearInterval(undoCountdownTimer.current);

    setUndoItem(item);
    setUndoSeconds(5);

    // update countdown every second
    undoCountdownTimer.current = setInterval(() => {
      setUndoSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(undoCountdownTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // finalize deletion after 5s
    undoDeleteTimer.current = setTimeout(async () => {
      try {
        await deleteItem(item.id);
      } catch (err) {
        console.error("Failed to delete item:", err);
      } finally {
        clearInterval(undoCountdownTimer.current!);
        setUndoItem(null);
        setUndoSeconds(5);
      }
    }, 5000);
  }

  /** Undo deletion */
  function handleUndo() {
    if (!undoItem) return;
    if (undoDeleteTimer.current) clearTimeout(undoDeleteTimer.current);
    if (undoCountdownTimer.current) clearInterval(undoCountdownTimer.current);

    setItems((prev) => [undoItem, ...prev]);
    setUndoItem(null);
    setUndoSeconds(5);
  }

  /** Confirm delete action */
  function confirmDelete(id: string) {
    const item = items.find((x) => x.id === id);
    if (!item) return;

    Alert.alert("Delete item?", "You can undo for a few seconds.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setItems((prev) => prev.filter((x) => x.id !== id));
          startUndoCountdown(item);
        },
      },
    ]);
  }

  const showEmptyState =
    !loading && !errorMsg && items.length === 0 && query.trim() === "";

  return (
    <View className="flex-1 bg-app-bg relative">
      <ScreenHeader screenName="Where Did I Put That?" showLogo />

      {/* Search bar */}
      <View className="px-4 mt-6">
        <View className="bg-app-card border border-app-border rounded-card p-4 mb-6 flex-row items-center">
          <Icon name="search" size={18} color="#64748B" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search items or locations..."
            className="ml-3 flex-1 text-app-text"
            placeholderTextColor="#64748B"
          />
          {query && (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={12}
              className="ml-2"
            >
              <Icon name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Items list */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        className="px-4"
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        ListHeaderComponent={
          <View>
            {loading && <Text className="text-app-muted mb-3">Loading…</Text>}
            {!loading && errorMsg && (
              <Text className="text-app-muted mb-3">{errorMsg}</Text>
            )}
            {!loading &&
              !errorMsg &&
              !showEmptyState &&
              filteredItems.length === 0 && (
                <Text className="text-app-muted mb-3">
                  No matches. Try a different search.
                </Text>
              )}
            {showEmptyState && (
              <View className="bg-app-card border border-app-border rounded-card p-4 mb-4">
                <Text className="text-app-text text-lg font-semibold">
                  Add your first item
                </Text>
                <Text className="text-app-muted mt-1">
                  Start with something you always forget — like holiday
                  decorations or spare keys.
                </Text>
                <View className="my-5">
                  <CustomButton
                    onPress={() => router.push("/add-item")}
                    iconName="add"
                    text="Add Item"
                  />
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ItemCard
            id={item.id}
            title={item.name}
            location={item.location}
            datetime={item.createdAt}
            onEdit={(id) => router.push(`/edit-item/${id}`)}
            onDelete={confirmDelete}
          />
        )}
      />

      {/* Undo Snackbar */}
      {undoItem && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 110 + insets.bottom,
            zIndex: 50,
            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <View className="bg-app-card border border-app-border rounded-card px-4 py-6 flex-row items-center justify-between">
            <Text className="text-app-text" numberOfLines={1}>
              Deleted “{undoItem.name}” ({undoSeconds})
            </Text>
            <Pressable onPress={handleUndo} hitSlop={12}>
              <Text className="text-app-accent font-semibold">Undo</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
