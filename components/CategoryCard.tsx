import { Ionicons as Icon } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
};

export default function CategoryCard({
  label,
  icon,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`w-[31%] mb-3 rounded-xl p-3 items-center ${
        selected
          ? "bg-app-surface border border-app-accent"
          : "bg-app-card border border-app-border"
      }`}
    >
      <Icon
        name={icon as any}
        size={22}
        color={selected ? "#4F8A8B" : "#64748B"}
      />

      <Text
        className={`mt-1 text-xs text-center ${
          selected ? "text-app-accent font-medium" : "text-app-text"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
