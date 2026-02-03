import { Ionicons as Icon } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ItemCardProps = {
  id: string;
  title: string;
  location: string;
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
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export default function ItemCard({
  id,
  title,
  location,
  datetime,
  onEdit,
  onDelete,
}: ItemCardProps) {
  return (
    <View className="bg-app-card border border-app-border rounded-card px-4 py-4 mb-3 flex-row items-start">
      {/* Left / main content (70%) */}

      <View className="flex-1 pr-3">
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

      {/* Right actions (icons) */}
      <View className="flex-row items-center gap-3 pt-1">
        <Pressable
          onPress={() => onEdit?.(id)}
          hitSlop={20}
          className="w-14 h-14 rounded-full items-center justify-center bg-app-surface border border-app-border"
        >
          <Icon name="create-outline" size={20} color="#4F8A8B" />
        </Pressable>

        <Pressable
          onPress={() => onDelete?.(id)}
          hitSlop={10}
          className="w-14 h-14 rounded-full items-center justify-center bg-app-surface border border-app-border"
        >
          <Icon name="trash-outline" size={18} color="#64748B" />
        </Pressable>
      </View>
    </View>
  );
}
