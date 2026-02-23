import { usePathname } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const activeColor = "#1E293B";
  const inactiveColor = "#6B7280";

  // segments example:
  // ["(tabs)", "index"]
  // ["(tabs)", "rooms"]
  const pathname = usePathname();
  const shouldShowFab = pathname.endsWith("/index") || pathname === "/";

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 78,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
            borderRadius: 20,
            elevation: 4,
            backgroundColor: colorScheme === "dark" ? "#000000" : "#EFEFEC",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={26}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="rooms"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="grid"
                size={26}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
      </Tabs>

      {/* Conditional FAB */}
      {shouldShowFab && (
        <TouchableOpacity
          onPress={() => router.push("/add-item")}
          activeOpacity={0.9}
          style={{
            position: "absolute",
            bottom: 35,
            alignSelf: "center",
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: "#4F8A8B",
            alignItems: "center",
            justifyContent: "center",
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
