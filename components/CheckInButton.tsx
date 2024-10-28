import { Text, StyleSheet, Dimensions, Pressable } from "react-native";
import React from "react";
import Auth from "./Auth/Auth";

type checkInProps = {
	token: string | undefined;
	readNdef: () => void;
};

const { width: DeviceWidth } = Dimensions.get("window");

const CheckInButton = (props: checkInProps) => {
	const { token, readNdef } = props;


	if (token != null && token.length == 0) {
		return <Auth />;
	}

	return (
		<Pressable
			style={({ pressed }) =>
				pressed ? { ...styles.button, backgroundColor: "#91AAAF" } : styles.button
			}
			onPress={readNdef}
		>
			<Text style={styles.buttonText}>Scan a tag</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "black",
		paddingVertical: 12,
		elevation: 3,
		width: DeviceWidth - 100,
		paddingHorizontal: 12,
		alignItems: "center",
		justifyContent: "center",
	},

	buttonText: {
		color: "white",
		lineHeight: 21,
		fontWeight: "bold",
	},
});

export default CheckInButton;
