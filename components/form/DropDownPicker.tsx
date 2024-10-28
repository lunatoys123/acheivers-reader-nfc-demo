import { View, Text, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Picker } from "@react-native-picker/picker";

type dropdownProps = {
	label: string;
	value: string;
};

type SelectProps = {
	header: string;
	data: dropdownProps[];
	selectedValue: string;
	setSelectedValue: Dispatch<SetStateAction<string>>;
};

const DropDownPicker = (props: SelectProps) => {
	const { header, data, selectedValue, setSelectedValue } = props;
	return (
		<View style={styles.dropdown}>
			<Text style={styles.label}>{header}</Text>
			<View
				style={{
					borderWidth: 0.5,
					borderRadius: 8,
					width: "90%",
				}}
			>
				<Picker
					mode="dropdown"
					selectedValue={selectedValue}
					onValueChange={itemValue => {
						setSelectedValue(itemValue);
					}}
				>
					{data.map(item => {
						return (
							<Picker.Item
								label={item.label}
								value={item.value}
								key={item.value}
							/>
						);
					})}
				</Picker>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	dropdown: { width: "100%", justifyContent: "center", alignItems: "center" },
	label: { fontFamily: "monospace", fontWeight: "bold" },
});

export default DropDownPicker;
