import { View, Text, Pressable, TextInput, Button, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";

type UserPromptType = {
	username: string;
	setUsername: Dispatch<SetStateAction<string>>;
	CancelNdef: () => void;
	addUser: () => void;
	errorText: string;
};

const UserPrompt = (props: UserPromptType) => {
	const { username, setUsername, CancelNdef, addUser, errorText } = props;
	return (
		<View style={styles.userPromptLayout}>
			<View style={styles.exitLayout}>
				<Pressable onPress={() => CancelNdef()}>
					<Text>X</Text>
				</Pressable>
			</View>
			<View>
				<Text style={styles.title}>New User</Text>
				<Text style={styles.mono}>
					Detecting a new user join the login system. Please enter your name and press confirm
					button to continue
				</Text>
			</View>
			<TextInput
				placeholder="name"
				style={styles.input}
				value={username}
				onChangeText={setUsername}
			/>
			<Text style={styles.warning}>{errorText}</Text>
			<Button
				title="confirm"
				onPress={addUser}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	input: { borderWidth: 0.3, width: "100%", height: 40, padding: 10, borderRadius: 8 },
	userPromptLayout: {
		justifyContent: "center",
		alignItems: "center",
		rowGap: 8,
	},
	exitLayout: {
		width: 300,
		flexDirection: "row-reverse",
	},

	title: {
		fontWeight: "bold",
		fontSize: 18,
	},

	mono: { fontFamily: "monospace" },
	warning: { color: "red" },
});

export default UserPrompt;
