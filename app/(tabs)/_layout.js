import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Ionicons
import { useFocusEffect } from "@react-navigation/native"; // ✅ Import useFocusEffect
import { useCallback } from "react";

export default function TabLayout() {
  useFocusEffect(
    useCallback(() => {
      // Refresh logic here
      console.log("Tab layout refreshed!");
      // Add any additional logic to refresh data or state
    }, [])
  );

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#ffc928",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 8,
        },
        headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
            {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
          </Text>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          position: "absolute",
          height: 70,
          paddingTop: 5,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        },
        tabBarActiveTintColor: "#ffc928",
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
