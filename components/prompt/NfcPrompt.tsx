import { View, Text, ActivityIndicator, StyleSheet, Button, Pressable } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


type NfcPromptType = {
	nfcEnabled: boolean;
	setTriggerModel: Dispatch<SetStateAction<boolean>>;
	CancelNdef: () => void;
};

const NfcPrompt = (props: NfcPromptType) => {
	const { nfcEnabled, setTriggerModel, CancelNdef} =
		props;
	return (
		<View style={styles.container}>
			<View style={{ width: 300, flexDirection: "row-reverse" }}>
				<Pressable
					style={styles.exitButton}
					onPress={() => CancelNdef()}
				>
					<Text>X</Text>
				</Pressable>
			</View>
			<MaterialIcons
				name="nfc"
				size={48}
				color="black"
			/>
			{nfcEnabled ? (
				<View style={{ gap: 8 }}>
					<View style={styles.horizontal}>
						<ActivityIndicator
							size="small"
							color="#0000ff"
						/>
						<Text>Waiting for Scanning NFC</Text>
					</View>
				</View>
			) : (
				<View style={styles.standard}>
					<Text>Not detecting Nfc on your device. Please start NFC</Text>
					<Button
						title="Go back"
						onPress={() => setTriggerModel(false)}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	horizontal: {
		flexDirection: "row",
		gap: 20,
		marginVertical: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	standard: {
		gap: 20,
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
	},

	exitButton: {
		borderWidth: 1,
		borderRadius: 3,
		padding: 6,
	},
});

export default NfcPrompt;
