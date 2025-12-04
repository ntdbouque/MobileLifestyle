import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />

    <Tabs.Screen
        name="stat"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="chart-line" size={24} color={color} />
          ),
        }}
      />

    <Tabs.Screen
        name="bot"
        options={{
            title: "Bot",
            tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="robot" size={24} color={color} />
            ),
        }}
    />

    <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
    />



    </Tabs>
  );
}
