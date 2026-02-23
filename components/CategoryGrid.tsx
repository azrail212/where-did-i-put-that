import { ITEM_CATEGORIES } from "@/lib/categories";
import { View } from "react-native";
import CategoryCard from "./CategoryCard";

type Props = {
  selectedCategory: string;
  onSelect: (label: string) => void;
};

export default function CategoryGrid({ selectedCategory, onSelect }: Props) {
  return (
    <View className="flex-row flex-wrap justify-between mb-6">
      {ITEM_CATEGORIES.map((cat) => (
        <CategoryCard
          key={cat.label}
          label={cat.label}
          icon={cat.icon}
          selected={cat.label === selectedCategory}
          onPress={() => onSelect(cat.label)}
        />
      ))}
    </View>
  );
}
