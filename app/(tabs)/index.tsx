import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, Dimensions } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import NfcPrompt from "@/components/prompt/NfcPrompt";
import UserPrompt from "@/components/prompt/UserPrompt";
import ErrorPrompt from "@/components/prompt/ErrorPrompt";
import DropDownPicker from "@/components/form/DropDownPicker";
import { DropDownOption, locationOption } from "../../utils/Option";
import { useAppSelector } from "@/hook";
import { Auth } from "@/Redux/Auth/AuthSlice";
import CheckInButton from "@/components/CheckInButton";
import { AppendAPI, CheckInAPI, UserDataAPI } from "@/utils/API/UserFunc";

const { width: DeviceWidth } = Dimensions.get("window");

NfcManager.start();
const CheckIn = () => {
	const AuthSelector = useAppSelector(Auth);
	const { token } = AuthSelector;
	const SpreadSheetID = process.env.EXPO_PUBLIC_sheetID;
	const [triggerModel, setTriggerModel] = useState<boolean>(false);
	const [addUserModel, setAddUserModel] = useState<boolean>(false);
	const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);
	const [selectedMode, setSelectedMode] = useState<string>("Punch In");
	const [location, setLocation] = useState<string>("location1");
	const [username, setUsername] = useState<string>("");
	const [tagId, setTagId] = useState<string | undefined>("");
	const [errorModal, setErrorModal] = useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>("");

	const getCurrentDateFormatted = () => {
		const now = new Date();

		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
		const day = String(now.getDate()).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		//const seconds = String(now.getSeconds()).padStart(2, "0");

		return `${year}/${month}/${day} ${hours}:${minutes}`;
	};

	const CheckInStatus = async (octopus_id: string | undefined) => {
		const CheckInResponse = await CheckInAPI(SpreadSheetID, token);
		const { values } = CheckInResponse?.data ?? null;
		if (values) {
			const now = new Date();

			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
			const day = String(now.getDate()).padStart(2, "0");

			const todayString = `${year}/${month}/${day}`;

			let filtered_data = values.filter(
				(arr: any[]) => arr[0].includes(todayString) && arr[1] == octopus_id && arr[4] == location
			);
			return filtered_data;
		} else {
			return [];
		}
	};

	const UserData = async (octopus_id: string | undefined) => {
		const UserDataResponse = await UserDataAPI(SpreadSheetID, token);
		const { values } = UserDataResponse?.data ?? null;

		if (values) {
			const user_data = values.filter((val: any) => val[0] == octopus_id);
			return user_data;
		}
	};

	const appendWorkSheet = async (octopus_id: string | undefined, Range: string, values: any[]) => {
		const Checkin_data = await CheckInStatus(octopus_id);

		const select_mode_data = Checkin_data.filter((arr: any[]) => arr[3] == selectedMode && arr[4] == location);

		if(selectedMode == "Punch Out"){
			const CheckIn = Checkin_data.filter((arr: any[]) => arr[3] == "Punch In" && arr[4] == location);
			setErrorModal(true);
			if(CheckIn.length == 0){
                setErrorText(`Punch In data is required for Punch Out Record`);
            }
			return;

		}
		
		if (select_mode_data.length > 0) {
			setErrorModal(true);
			setErrorText(`Already find your ${selectedMode} data in Check in table for today`);
			return;
		}

		await AppendAPI(SpreadSheetID, Range, values, token);
	};

	const readNdef = async () => {
		const isEnabled = await NfcManager.isEnabled();

		setNfcEnabled(isEnabled);

		if (!isEnabled) {
			console.log("NFC is not enabled for this device");
			return;
		}

		setTriggerModel(true);

		try {
			await NfcManager.requestTechnology(NfcTech.Ndef);

			const tag = await NfcManager.getTag();

			if (tag) {
				const user_data = await UserData(tag.id);

				if (user_data.length == 0) {
					setTriggerModel(false);
					setAddUserModel(true);
					setTagId(tag.id);
				} else {
					const flat_user_data = user_data.flat();
					const values = [
						[getCurrentDateFormatted(), tag.id, flat_user_data[1], selectedMode, location],
					];
					await appendWorkSheet(tag.id, "checkIn_table!A1:E", values);
				}

				setTriggerModel(false);
			}
		} catch (err) {
			console.error("[readNdef] ", err);
		} finally {
			console.log("[readNdef] cancel NfcManager Technology request");
			NfcManager.cancelTechnologyRequest();
		}
	};

	const CancelNdef = () => {
		console.log("[CancelNdef] cancel NfcManager Technology request");
		NfcManager.cancelTechnologyRequest();
		setTriggerModel(false);
		setAddUserModel(false);
	};

	const addUser = async () => {
		if (!username) {
			setErrorText("username should not be empty");
			return;
		}

		const userValues = [[tagId, username]];
		await AppendAPI(SpreadSheetID, "student_table!A1:E", userValues, token);
		const values = [[getCurrentDateFormatted(), tagId, username, selectedMode, location]];
		await appendWorkSheet(tagId, "checkIn_table!A1:E", values);
		setAddUserModel(false);
		setTagId("");
		setUsername("");
	};

	return (
		<View style={styles.Container}>
			<View style={styles.Login}>
				<Text style={styles.bold}>Acheiver's Ladder Login System</Text>
				<CheckInButton
					token={token}
					readNdef={readNdef}
				/>
			</View>
			<View style={styles.pickerView}>
				<DropDownPicker
					data={DropDownOption}
					selectedValue={selectedMode}
					setSelectedValue={setSelectedMode}
					header="status"
				/>
				<DropDownPicker
					data={locationOption}
					selectedValue={location}
					setSelectedValue={setLocation}
					header="location"
				/>
			</View>

			<Modal
				visible={triggerModel}
				transparent={true}
				animationType="slide"
			>
				<View style={styles.prompt}>
					<NfcPrompt
						nfcEnabled={nfcEnabled}
						setTriggerModel={setTriggerModel}
						CancelNdef={CancelNdef}
					/>
				</View>
			</Modal>

			<Modal
				visible={addUserModel}
				transparent={true}
				animationType="slide"
			>
				<View style={styles.prompt}>
					<UserPrompt
						errorText={errorText}
						username={username}
						setUsername={setUsername}
						CancelNdef={CancelNdef}
						addUser={addUser}
					/>
				</View>
			</Modal>

			<Modal
				visible={errorModal}
				transparent={true}
				animationType="slide"
			>
				<ErrorPrompt
					errorText={errorText}
					setErrorModal={setErrorModal}
					CancelNdef={CancelNdef}
					setErrorText={setErrorText}
				/>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	Container: {
		flex: 1,
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
	},

	Login: {
		backgroundColor: "white",
		padding: 30,
		borderRadius: 8,
		gap: 5,
		elevation: 10,
		maxWidth: DeviceWidth * 0.9,
		justifyContent: "center",
		alignItems: "center",
	},

	bold: {
		fontFamily: "lucida grande",
		fontWeight: "bold",
		fontSize: 18,
	},

	prompt: {
		position: "absolute",
		bottom: 60,
		padding: 20,
		backgroundColor: "white",
		width: "95%",
		alignSelf: "center",
		borderRadius: 8,
	},

	horizontal: {
		flexDirection: "row",
		gap: 8,
	},

	pickerView: {
		borderRadius: 8,
		margin: 10,
		width: DeviceWidth * 0.9,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 20,
		rowGap: 10,
		backgroundColor: "white",
		elevation: 3,
	},

	input: { borderWidth: 0.3, width: "100%", height: 40, padding: 10, borderRadius: 8 },
});

export default CheckIn;
