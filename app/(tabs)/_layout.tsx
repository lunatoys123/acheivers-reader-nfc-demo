import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { height: 60 },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Check in",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "checkbox-outline" : "checkbox-sharp"}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Users"
				options={{
					title: "Users",
					tabBarIcon: ({ color, focused }) => (
						<FontAwesome
							name={focused ? "user" : "user-o"}
							size={28}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Record"
				options={{
					title: "Record",
					tabBarIcon: ({ color, focused }) => (
						<Foundation
							name="book"
							size={28}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
