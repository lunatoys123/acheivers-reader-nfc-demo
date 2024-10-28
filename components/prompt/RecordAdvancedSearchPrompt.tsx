import { View, Text, TouchableOpacity, Pressable, TextInput, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { formatDate } from "@/utils/Func";
import DateTimePicker from "react-native-ui-datepicker";
import { Picker } from "@react-native-picker/picker";
import { searchLocationOption } from "@/utils/Option";
import { Button, Divider } from "@rneui/base";

type RecordAdvancedSearchProps = {
	setAdvancedSearch: Dispatch<SetStateAction<boolean>>;
	setShowDateModel: Dispatch<SetStateAction<boolean>>;
	selectStartDate: any;
	selectEndDate: any;
	showDateModel: boolean;
	setSelectStartDate: Dispatch<SetStateAction<any>>;
	setSelectEndDate: Dispatch<SetStateAction<any>>;
	setLocation: Dispatch<SetStateAction<string>>;
	location: string;
	ObtainRecord: () => Promise<void>;
};

const RecordAdvancedSearchPrompt = (props: RecordAdvancedSearchProps) => {
	const {
		setAdvancedSearch,
		setShowDateModel,
		selectStartDate,
		selectEndDate,
		showDateModel,
		setSelectStartDate,
		setSelectEndDate,
		setLocation,
		location,
		ObtainRecord,
	} = props;
	return (
		<TouchableOpacity
			style={styles.promptLayout}
			activeOpacity={1}
			onPress={() => setAdvancedSearch(false)}
		>
			<View style={styles.promptContainer}>
				<Text style={styles.title}>Advanced Search</Text>
				<View style={styles.promptLayout}>
					<View style={styles.promptItemLabel}>
						<Text>Date</Text>
					</View>
					<View style={styles.promptItemContent}>
						<Pressable onPress={() => setShowDateModel(prev => !prev)}>
							<TextInput
								placeholder="select date"
								value={`${formatDate(selectStartDate)} - ${formatDate(selectEndDate)}`}
								editable={false}
								style={[styles.border, { padding: 10 }]}
							/>
							{showDateModel && (
								<View style={[styles.border, { padding: 10 }]}>
									<DateTimePicker
										mode="range"
										startDate={selectStartDate}
										endDate={selectEndDate}
										onChange={({ startDate, endDate }) => {
											setSelectEndDate(endDate);
											setSelectStartDate(startDate);
										}}
									/>
									<Button
										title="clear"
										color="error"
										onPress={() => {
											setSelectEndDate(undefined);
											setSelectStartDate(undefined);
										}}
									/>
								</View>
							)}
						</Pressable>
					</View>
				</View>
				<View style={styles.promptLayout}>
					<View style={styles.promptItemLabel}>
						<Text>Location</Text>
					</View>
					<View style={[styles.promptItemContent, styles.border]}>
						<Picker
							mode="dropdown"
							selectedValue={location}
							onValueChange={itemValue => setLocation(itemValue)}
						>
							{searchLocationOption.map(item => (
								<Picker.Item
									key={item.value}
									label={item.label}
									value={item.value}
								/>
							))}
						</Picker>
					</View>
				</View>
				<Divider />
				<View>
					<Button
						title="search"
						onPress={() => {
							ObtainRecord();
							setAdvancedSearch(false);
						}}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	promptLayout: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
	promptContainer: {
		position: "absolute",
		bottom: 60,
		padding: 20,
		backgroundColor: "white",
		width: "100%",
		alignSelf: "center",
		borderRadius: 8,
		rowGap: 10,
	},
	title: { fontWeight: "bold", alignSelf: "center" },
	promptItemLayout: { flexDirection: "row" },
	promptItemLabel: { width: "20%" },
	promptItemContent: { width: "80%" },
	border: { borderWidth: 0.3, borderRadius: 8 },
});

export default RecordAdvancedSearchPrompt;
