import {
	View,
	Text,
	SafeAreaView,
	SectionList,
	StyleSheet,
	RefreshControl,
	Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/hook";
import { Auth } from "@/Redux/Auth/AuthSlice";
import { CheckInAPI } from "@/utils/API/UserFunc";
import dayjs from "dayjs";
import { formatDate } from "@/utils/Func";
import isBetween from "dayjs/plugin/isBetween";
import RecordSearchArea from "@/components/form/RecordSearchArea";
import RecordAdvancedSearchPrompt from "@/components/prompt/RecordAdvancedSearchPrompt";

dayjs.extend(isBetween);

const Record = () => {
	const SpreadSheetID = process.env.EXPO_PUBLIC_sheetID;
	const userSelector = useAppSelector(Auth);
	const { token } = userSelector;
	const [checkInData, setCheckInData] = useState<any[]>([]);
	const [refresh, setRefresh] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>("");
	const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
	const [selectStartDate, setSelectStartDate] = useState<any>(undefined);
	const [selectEndDate, setSelectEndDate] = useState<any>(undefined);
	const [showDateModel, setShowDateModel] = useState<boolean>(false);
	const [location, setLocation] = useState<string>("");

	const sectionHeader = ({ section: { title } }: any) => (
		<View style={styles.HeaderLayout}>
			<Text style={styles.HeaderText}>{title.split("-")[0]}</Text>
			<Text style={{ paddingLeft: 10 }}>({title.split("-")[1]})</Text>
		</View>
	);

	const sectionItem = ({ item }: any) => {
		const CheckIn = item.filter((val: { status: string }) => val.status == "Punch In")[0];
		const CheckOut = item.filter((val: { status: string }) => val.status == "Punch Out")[0];

		return (
			<View style={styles.ItemLayout}>
				<View style={styles.Item}>
					<View style={{ width: "30%" }}>
						<Text>{getName(CheckIn, CheckOut)}</Text>
					</View>
					<View style={{ width: "70%" }}>
						<Text>
							{`${CheckIn ? CheckIn.checkInDateTime.split(" ")[1] : "(no CheckIn Time)"} - ${
								CheckOut ? CheckOut.checkInDateTime.split(" ")[1] : "(No CheckOut Time)"
							}`}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	const filterDate = (date1: string) => {
		if (selectStartDate == null && selectEndDate == null) {
			return true;
		}

		let startDate = selectStartDate;
		let endDate = selectEndDate;

		if (selectStartDate == null) {
			startDate = formatDate(dayjs().toDate());
		}

		if (selectEndDate == null) {
			endDate = formatDate(dayjs().toDate());
		}

		const CheckInDate = dayjs(date1);
		startDate = dayjs(startDate);
		endDate = dayjs(endDate);

		return CheckInDate.isBetween(startDate, endDate, null, "[]");
	};

	const filterLocation = (student_location: string) => {
		if (location.trim().length == 0) return true;

		return student_location == location;
	};

	const ObtainRecord = async () => {
		setRefresh(true);
		const checkIn = await CheckInAPI(SpreadSheetID, token);
		const { values } = checkIn?.data ?? null;

		const datamap = new Map();

		if (values) {
			for (let i = 0; i < values.length; i++) {
				let copyValues = [...values];

				const checkInDate = formatDate(copyValues[i][0]);
				const checkInDateTime = copyValues[i][0];
				const octopus_id = copyValues[i][1];
				const student_name = copyValues[i][2];
				const status = copyValues[i][3];
				const student_location = copyValues[i][4];

				const key = `${checkInDate}_${octopus_id}_${student_location}`;

				if (
					searchText.trim().length > 0 &&
					!student_name.includes(searchText) &&
					!student_location.includes(searchText)
				)
					continue;

				const valueJson = {
					checkInDateTime: checkInDateTime,
					status: status,
					student_name: student_name,
					location: student_location,
				};

				if (!datamap.has(key)) {
					const value = [valueJson];
					datamap.set(key, value);
				} else {
					const value = datamap.get(key);
					const newValue = [...value, valueJson];
					datamap.set(key, newValue);
				}
			}
		}
		let sortedDataMap = new Map([...datamap.entries()].sort((a, b) => a[0].localeCompare(b[0])));
		sortedDataMap = new Map(
			[...sortedDataMap].filter(([key, _value]) => {
				const CheckInDate = key.split("_")[0];
				const location = key.split("_")[2];

				return filterDate(CheckInDate) && filterLocation(location);
			})
		);

		const groupDataMap = new Map();
		for (let [key, value] of sortedDataMap) {
			const DateTime = `${key.split("_")[0]} - ${key.split("_")[2]}`;

			if (!groupDataMap.has(DateTime)) {
				const newData = [value];
				groupDataMap.set(DateTime, newData);
			} else {
				const Mapvalue = groupDataMap.get(DateTime);
				const newValue = [...Mapvalue, value];
				groupDataMap.set(DateTime, newValue);
			}
		}

		const checkInMaptoData = Array.from(groupDataMap, ([key, value]) => ({
			title: key,
			data: value,
		}));

		setCheckInData(checkInMaptoData);
		setRefresh(false);
	};

	const getName = (CheckIn: any, CheckOut: any) => {
		if (!CheckIn) {
			return CheckOut.student_name;
		}

		return CheckIn.student_name;
	};

	useEffect(() => {
		if (token != null && token.length > 0) {
			ObtainRecord();
		}
	}, [token]);

	return (
		<SafeAreaView style={styles.RecordLayout}>
			<RecordSearchArea
				setSearchText={setSearchText}
				ObtainRecord={ObtainRecord}
				setAdvancedSearch={setAdvancedSearch}
			/>
			<View style={styles.SectionLayout}>
				<SectionList
					sections={checkInData}
					keyExtractor={(item, index) => item + index}
					initialNumToRender={10}
					windowSize={5}
					maxToRenderPerBatch={10}
					renderSectionHeader={sectionHeader}
					renderItem={sectionItem}
					refreshControl={
						<RefreshControl
							refreshing={refresh}
							onRefresh={ObtainRecord}
						/>
					}
					stickySectionHeadersEnabled
					scrollEventThrottle={16}
				/>
			</View>
			<Modal
				visible={advancedSearch}
				transparent={true}
				animationType="slide"
			>
				<RecordAdvancedSearchPrompt
					setAdvancedSearch={setAdvancedSearch}
					setShowDateModel={setShowDateModel}
					selectStartDate={selectStartDate}
					selectEndDate={selectEndDate}
					showDateModel={showDateModel}
					setSelectStartDate={setSelectStartDate}
					setSelectEndDate={setSelectEndDate}
					setLocation={setLocation}
					location={location}
					ObtainRecord={ObtainRecord}
				/>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	RecordLayout: { flex: 1, paddingTop: 20 },
	SectionLayout: {
		borderRadius: 8,
		rowGap: 10,
		paddingBottom: 70,
	},
	HeaderLayout: { backgroundColor: "rgba(240, 240, 240, 1)", padding: 10 },
	HeaderText: { paddingLeft: 10, fontSize: 18 },
	ItemLayout: {
		backgroundColor: "white",
		elevation: 1,
		width: "90%",
		alignSelf: "center",
	},
	Item: { flexDirection: "row", padding: 10 },
});

export default Record;
