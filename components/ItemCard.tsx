import { ITEM_CATEGORIES } from "@/lib/categories";
import { Ionicons as Icon } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ItemCardProps = {
  id: string;
  title: string;
  location: string;
  category: string;
  datetime: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return (
    date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

export default function ItemCard({
  id,
  title,
  location,
  category,
  datetime,
  onEdit,
  onDelete,
}: ItemCardProps) {
  const categoryMeta =
    ITEM_CATEGORIES.find((c) => c.label === category) ??
    ITEM_CATEGORIES[ITEM_CATEGORIES.length - 1];

  return (
    <View className="bg-app-card border border-app-border rounded-card p-4 mb-4 flex-row items-start">
      {/* Category Icon Badge */}
      <View className="w-12 h-12 rounded-xl bg-app-surface border border-app-border items-center justify-center mr-4">
        <Icon name={categoryMeta.icon as any} size={22} color="#4F8A8B" />
      </View>

      {/* Main Content */}
      <View className="flex-1">
        <Text
          className="text-app-text font-semibold text-base"
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text className="text-app-muted mt-1" numberOfLines={2}>
          {location}
        </Text>

        <Text className="text-app-muted text-xs mt-2">
          Added {formatDate(datetime)}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center ml-3">
        <Pressable
          onPress={() => onEdit?.(id)}
          hitSlop={20}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Icon name="create-outline" size={20} color="#4F8A8B" />
        </Pressable>

        <Pressable
          onPress={() => onDelete?.(id)}
          hitSlop={20}
          className="w-10 h-10 rounded-full items-center justify-center ml-2"
        >
          <Icon name="trash-outline" size={20} color="#64748B" />
        </Pressable>
      </View>
    </View>
  );
}
