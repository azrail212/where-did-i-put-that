import { Ionicons as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";
type ScreenHeaderProps = {
  screenName: string;
  backButton?: boolean;
  showLogo?: boolean;
};

export default function ScreenHeader({
  screenName,
  backButton = false,
  showLogo = false,
}: ScreenHeaderProps) {
  return (
    <View className="bg-white pt-14 items-center px-4 pb-3 border-b border-app-border flex-row gap-4 ">
      {backButton && (
        <Icon
          name="arrow-back"
          size={28}
          color="#000"
          onPress={() => router.back()}
        />
      )}

      {showLogo && (
        <Image
          source={require("@/assets/images/logo.png")}
          className="h-20 w-20"
          resizeMode="contain"
        />
      )}

      <Text className="text-app-text text-2xl font-semibold flex-1">
        {screenName}
      </Text>
    </View>
  );
}
