import { Ionicons as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
type ScreenHeaderProps = {
  screenName: string;
  backButton?: boolean;
};

export default function ScreenHeader({
  screenName,
  backButton = false,
}: ScreenHeaderProps) {
  return (
    <View className="bg-white pt-20 items-left px-4 pb-6 border-b border-app-border flex-row gap-4">
      {backButton && (
        <Icon
          name="arrow-back"
          size={28}
          color="#000"
          onPress={() => router.back()}
        />
      )}

      {/* Title */}
      <Text className="text-app-text text-2xl font-semibold">{screenName}</Text>
    </View>
  );
}
