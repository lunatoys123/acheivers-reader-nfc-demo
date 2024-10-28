import { View, Text, Button, Dimensions, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";

type ErrorPromptType = {
	errorText: string;
	CancelNdef: () => void;
	setErrorModal: Dispatch<SetStateAction<boolean>>;
	setErrorText: Dispatch<SetStateAction<string>>;
};

const { width: DeviceWidth } = Dimensions.get("window");

const ErrorPrompt = (props: ErrorPromptType) => {
	const { errorText, CancelNdef, setErrorModal, setErrorText } = props;
	return (
		<View style={styles.ErrorPromptLayout}>
			<View style={styles.ErrorPromptView}>
				<Text style={styles.ErrorText}>Warning</Text>
				<Text style={styles.mono}>{errorText}</Text>
				<Button
					title="confirm"
					onPress={() => {
						CancelNdef();
						setErrorModal(false);
						setErrorText("");
					}}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	ErrorPromptLayout: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "rgba(86, 86, 86, 0.8)",
	},
	ErrorPromptView: {
		backgroundColor: "white",
		width: DeviceWidth * 0.9,
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		padding: 10,
		maxHeight: 200,
		rowGap: 20,
	},
	ErrorText: { color: "red", fontSize: 18, fontWeight: "bold" },
	mono: { fontFamily: "monospace" },
});
export default ErrorPrompt;
