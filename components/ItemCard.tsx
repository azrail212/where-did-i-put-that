import icons from "@/assets/images/icons";
import { Image, Pressable, Text, View } from "react-native";

type ItemCardProps = {
  title: string;
  location: string;
  datetime: string;
};

export default function ItemCard({ title, location, datetime }: ItemCardProps) {
  function formatDate(iso: string) {
    const date = new Date(iso);

    if (isNaN(date.getTime())) {
      return "";
    }

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
  return (
    <View className="bg-app-card border border-app-border rounded-card p-4 mb-3 flex-row items-center gap-4 active:opacity-80">
      <Image
        className=" rounded-lg flex-shrink-0"
        source={icons.livingRoom}
        style={{ width: 50, height: 50 }}
        resizeMode="contain"
        tintColor="#4F8A8B"
      />

      <View className="flex-1">
        {/* Top row: title + edit */}
        <View className="flex-row items-start justify-between gap-2 mb-2">
          <Text
            className="text-app-text font-semibold text-base flex-1"
            numberOfLines={2}
          >
            {title}
          </Text>
          <Pressable className="bg-app-surface rounded-md px-2 py-1 flex-shrink-0">
            <Text className="text-app-accent text-xs font-medium">Edit</Text>
          </Pressable>
        </View>

        {/* Location */}
        <Text className="text-app-muted text-sm mb-1" numberOfLines={1}>
          {location}
        </Text>

        {/* Date / time */}
        <Text className="text-app-muted text-xs">{formatDate(datetime)}</Text>
      </View>
    </View>
  );
}
