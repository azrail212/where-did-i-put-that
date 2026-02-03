import { Ionicons as Icon } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type CustomButtonProps = {
  text: string;
  iconName: keyof typeof Icon.glyphMap;
  onPress: () => void;
  disabled?: boolean;
};

export default function CustomButton({
  text,
  iconName,
  onPress,
  disabled = false,
}: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-card py-4 items-center flex-row justify-center ${
        disabled ? "bg-app-accent/60" : "bg-app-accent"
      }`}
    >
      {iconName && (
        <View className="mr-2">
          <Icon name={iconName} size={18} color="white" />
        </View>
      )}

      <Text className="text-white font-medium">{text}</Text>
    </Pressable>
  );
}
