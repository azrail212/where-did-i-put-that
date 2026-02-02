import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72,
          paddingBottom: 8,
          paddingTop: 15,
          borderTopWidth: 0,
          position: "absolute",
          borderRadius: 16,
          shadowOpacity: 0,
          shadowRadius: 3,
          elevation: 1,
          backgroundColor: colorScheme === "dark" ? "#000000" : "#EFEFEC",
        },
      }}
    >
      {/*Home Screen Tab*/}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={28}
              color={focused ? "#4F8A8B" : "#6B7280"}
            />
          ),
        }}
      />

      {/* Add Item (accent action) */}

      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add Item",
          tabBarIcon: () => (
            <View
              style={{
                transform: [{ translateY: -18 }, { translateX: 60 }],
                elevation: 10, // Android shadow for the button
                shadowOpacity: 0.18, // iOS shadow for the button
                shadowRadius: 10,
                shadowOffset: { width: 2, height: 6 },
              }}
              className="w-16 h-16 rounded-full bg-app-accent items-center justify-center -mt-6"
            >
              <Ionicons name="add" size={30} color="white" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
