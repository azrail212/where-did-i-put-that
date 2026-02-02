import ItemCard from "@/components/ItemCard";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView className="bg-app-bg">
      <View className="flex-1 bg-app-bg px-4 pt-14">
        {/* Title */}
        <Text className="text-app-text text-2xl font-semibold mb-6">
          Where did I put that?
        </Text>

        {/* Placeholder items */}
        <ItemCard
          title="Christmas decorations"
          location="Garage · black box · top shelf"
          datetime="Feb 1, 2026 · 18:20"
        />

        <ItemCard
          title="Spare phone charger"
          location="Kitchen drawer · left side"
          datetime="Jan 28, 2026 · 09:05"
        />

        <ItemCard
          title="Kids documents"
          location="Bedroom closet · blue folder"
          datetime="Jan 15, 2026 · 12:30"
        />

        <ItemCard
          title="Tool set"
          location="Hallway cabinet · small box"
          datetime="Jan 10, 2026 · 20:10"
        />
      </View>
    </ScrollView>
  );
}
