import { View, Text, Dimensions, Pressable, TextInput, Button, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { Divider } from "@rneui/base";
import { UpdateFormData } from "@/utils/type";

const { width: DeviceWidth } = Dimensions.get("window");

type UpdatePromptProps = {
	setUpdated: Dispatch<SetStateAction<boolean>>;
	control: Control<UpdateFormData, any>;
	errors: FieldErrors<UpdateFormData>;
	handleSubmit: UseFormHandleSubmit<UpdateFormData, undefined>;
	updateUser: (data: UpdateFormData) => Promise<void>;
};

const UpdatePrompt = (props: UpdatePromptProps) => {
	const { setUpdated, control, errors, handleSubmit, updateUser } = props;

	return (
		<View style={styles.mainLayout}>
			<View style={styles.contentLayout}>
				<Pressable
					style={styles.exitLayout}
					onPress={() => setUpdated(false)}
				>
					<Text style={styles.exit}>X</Text>
				</Pressable>
				<Text style={styles.title}>update user</Text>
				<View>
					<Text style={{ fontWeight: "bold" }}>octopus id</Text>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						name="octopus_id"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								placeholder="octopus_id"
								style={styles.input}
							/>
						)}
					/>
					{errors.octopus_id && <Text style={styles.error}>Octopus id is required</Text>}
				</View>
				<Divider />
				<View>
					<Text style={{ fontWeight: "bold" }}>student name</Text>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						name="student_name"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								placeholder="student_name"
								style={styles.input}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
							/>
						)}
					/>
					{errors.student_name && <Text style={styles.error}>student name is required</Text>}
				</View>
				<Button
					title="submit"
					onPress={handleSubmit(updateUser)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	input: { borderWidth: 0.5, borderRadius: 8, height: 40, paddingLeft: 10 },
	exit: { color: "red", fontWeight: "bold" },
	exitLayout: { flexDirection: "row-reverse" },
	title: { fontWeight: "bold", fontSize: 18, alignSelf: "center" },
	error: { color: "red" },
	contentLayout: {
		backgroundColor: "white",
		width: DeviceWidth * 0.9,
		alignSelf: "center",
		justifyContent: "center",
		padding: 10,
		borderRadius: 8,
		rowGap: 10,
	},
	mainLayout: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "rgba(86, 86, 86, 0.8)",
	},
});

export default UpdatePrompt;
