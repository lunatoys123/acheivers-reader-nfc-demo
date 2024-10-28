import {
	View,
	StyleSheet,
	SafeAreaView,
	Text,
	Dimensions,
	FlatList,
	RefreshControl,
	Modal,
} from "react-native";
import React, { useState, useEffect, useCallback, SetStateAction, Dispatch } from "react";
import { ListItem, Button, Divider } from "@rneui/themed";
import { useAppSelector } from "@/hook";
import { Auth } from "@/Redux/Auth/AuthSlice";
import { Link } from "expo-router";
import SearchArea from "@/components/form/SearchArea";
import { useForm, UseFormSetValue } from "react-hook-form";
import UpdatePrompt from "@/components/prompt/UpdatePrompt";
import { UpdateFormData } from "@/utils/type";
import {
	getUserListAPI,
	fetchSpreadsheet,
	updateUserAPI,
	getSheetId,
	deleteUserAPI,
} from "@/utils/API/UserFunc";

const { width: DeviceWidth } = Dimensions.get("window");

const ItemDivider = () => {
	return <Divider />;
};

interface ItemRightProps {
	reset: () => void;
	setUpdated: Dispatch<SetStateAction<boolean>>;
	setValue: UseFormSetValue<UpdateFormData>;
	item: any;
	deleteUser: (item: UpdateFormData) => Promise<void>;
	getUserList: (data: string) => Promise<void>;
	searchString: string;
}

const ItemRightContent: React.FC<ItemRightProps> = ({
	reset,
	setUpdated,
	setValue,
	item,
	deleteUser,
	getUserList,
	searchString,
}) => {
	return (
		<View>
			<Button
				title="update"
				onPress={() => {
					setValue("keys", item.keys);
					setValue("octopus_id", item.octopus_id);
					setValue("student_name", item.student_name);
					setUpdated(true);
					reset();
				}}
				icon={{ name: "update", color: "white" }}
				buttonStyle={{ minHeight: "50%", backgroundColor: "blue" }}
			/>
			<Button
				title="Delete"
				onPress={() => {
					reset();
					deleteUser(item);
					getUserList(searchString);
				}}
				icon={{ name: "delete", color: "white" }}
				buttonStyle={{ minHeight: "50%", backgroundColor: "red" }}
			/>
		</View>
	);
};

const Users = () => {
	const SpreadSheetID = process.env.EXPO_PUBLIC_sheetID;
	const [userlist, setUserlist] = useState<any[]>([]);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [updated, setUpdated] = useState<boolean>(false);
	const [searchString, setSearchString] = useState<string>("");
	const userSelector = useAppSelector(Auth);
	const { token } = userSelector;

	const {
		handleSubmit: updateSubmit,
		control: updateControl,
		formState: { errors: updateErrors },
		setValue,
	} = useForm<UpdateFormData>({
		defaultValues: {
			keys: "",
			octopus_id: "",
			student_name: "",
		},
	});

	useEffect(() => {
		if (token != null && token.length > 0) getUserList(searchString);
	}, [token]);

	const getUserList = async (searchString: string) => {
		setRefreshing(true);
		let validResult = await getUserListAPI(searchString, SpreadSheetID, token);

		setUserlist(validResult);
		setRefreshing(false);
	};

	const updateUser = async (data: UpdateFormData) => {
		const UpdateResponse = await updateUserAPI(SpreadSheetID, token, data);
		if (UpdateResponse) {
			setUpdated(false);
			await getUserList(searchString);
		}
	};

	const deleteUser = async (item: UpdateFormData) => {
		setRefreshing(true);
		const spreadSheetInfo = await fetchSpreadsheet(SpreadSheetID, token);

		let sheetId = await getSheetId(spreadSheetInfo);

		//get current user
		const userList = await getUserListAPI(searchString, SpreadSheetID, token);

		const octopus_id = item.octopus_id;
		const student_name = item.student_name;

		const deleteDataList = userList.filter(
			val => val.octopus_id === octopus_id && val.student_name === student_name
		);

		const deleteData: UpdateFormData = deleteDataList[0];

		const row = parseInt(deleteData.keys) + 2;

		await deleteUserAPI(sheetId, row, SpreadSheetID, token);

		setRefreshing(false);
	};

	const ItemRenderer = useCallback(
		({ item }: any) => (
			<ListItem.Swipeable
				rightWidth={150}
				rightContent={reset => (
					<ItemRightContent
						reset={reset}
						setUpdated={setUpdated}
						setValue={setValue}
						item={item}
						deleteUser={deleteUser}
						getUserList={getUserList}
						searchString={searchString}
					/>
				)}
			>
				<ListItem.Content>
					<View style={styles.ItemRenderLayout}>
						<View style={styles.ItemTitleLayout}>
							<Text style={styles.bold}>octopus id</Text>
							<Text style={styles.bold}>student name</Text>
						</View>
						<View style={styles.ItemInfoLayout}>
							<Text>{item.octopus_id}</Text>
							<Text>{item.student_name}</Text>
						</View>
					</View>
				</ListItem.Content>
				<ListItem.Chevron />
			</ListItem.Swipeable>
		),
		[]
	);

	return (
		<SafeAreaView style={styles.UserLayout}>
			<SearchArea
				searchString={searchString}
				setSearchString={setSearchString}
				getUserList={getUserList}
				token={token}
			/>
			<View style={styles.UserLayout}>
				<Text style={styles.title}>User List</Text>
				{token != null && token.length > 0 ? (
					<View style={styles.card}>
						<FlatList
							data={userlist}
							renderItem={ItemRenderer}
							ItemSeparatorComponent={ItemDivider}
							removeClippedSubviews={true}
							keyExtractor={item => item.keys}
							initialNumToRender={10}
							windowSize={5}
							maxToRenderPerBatch={10}
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={() => getUserList(searchString)}
								/>
							}
						/>
					</View>
				) : (
					<Link
						href="/"
						style={styles.link}
					>
						This function require google , please go to Check in tab to log in
					</Link>
				)}
			</View>
			<Modal
				visible={updated}
				transparent={true}
				animationType="slide"
			>
				<UpdatePrompt
					setUpdated={setUpdated}
					control={updateControl}
					errors={updateErrors}
					handleSubmit={updateSubmit}
					updateUser={updateUser}
				/>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	UserLayout: {
		flex: 1,
		paddingVertical: 20,
		alignItems: "center",
	},
	card: {
		borderRadius: 8,
		margin: 10,
		width: DeviceWidth * 0.9,
		rowGap: 10,
		backgroundColor: "white",
		elevation: 3,
	},
	link: { color: "blue", textDecorationLine: "underline", maxWidth: DeviceWidth * 0.9 },
	ItemRenderLayout: { padding: 5, flexDirection: "row" },
	ItemInfoLayout: {
		flexDirection: "column",
		columnGap: 2,
		padding: 10,
		maxWidth: "60%",
	},
	ItemTitleLayout: { flexDirection: "column", columnGap: 2, padding: 10, maxWidth: "40%" },
	bold: { fontWeight: "bold" },
	title: { fontWeight: "bold", fontSize: 18 },
});

export default Users;
