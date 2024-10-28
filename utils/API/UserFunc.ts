import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	GoogleSignin,
	statusCodes,
	isSuccessResponse,
	isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import { UpdateFormData } from "../type";
import axios from "axios";

export const SignInFunc = createAsyncThunk("Auth/obtainToken", async (_params, thunkAPI) => {
	try {
		await GoogleSignin.hasPlayServices();
		const userInfo = await GoogleSignin.signIn();
		if (isSuccessResponse(userInfo)) {
			const tokens = await GoogleSignin.getTokens();
			return tokens.accessToken;
		}
	} catch (err: any) {
		if (isErrorWithCode(err)) {
			switch (err.code) {
				case statusCodes.IN_PROGRESS:
					return thunkAPI.rejectWithValue({ errorText: `Google Signin cancelled: ${err.message}` });
				case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
					return thunkAPI.rejectWithValue({
						errorText: `Google Play Services not available for this device: ${err.message}`,
					});
				case statusCodes.SIGN_IN_CANCELLED:
					return thunkAPI.rejectWithValue({
						errorText: `google signin is in progress: ${err.message}`,
					});
				case statusCodes.SIGN_IN_REQUIRED:
					return thunkAPI.rejectWithValue({ errorText: `google signin required: ${err.message}` });
			}
		}
	}
});

export const getUserListAPI = async (
	searchString: string,
	SpreadSheetID: string | undefined,
	token: string | undefined
): Promise<UpdateFormData[]> => {
	const Range = "student_table!A2:E";
	const UserURL = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}/values/${Range}`;

	let validResult = [];

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
	};

	try {
		const response = await axios.get(UserURL, headers);
		const { values } = response.data;
		if (values) {
			let copyValues = [...values];

			for (let i = 0; i < copyValues.length; i++) {
				const valueJson = {
					keys: i,
					octopus_id: copyValues[i][0],
					student_name: copyValues[i][1],
				};
				copyValues[i] = valueJson;
			}

			validResult = copyValues.filter(
				val =>
					val.octopus_id != null &&
					val.octopus_id.trim().length != 0 &&
					val.student_name != null &&
					val.student_name.trim().length != 0
			);

			if (searchString != null && searchString.length > 0) {
				validResult = validResult.filter(val =>
					val?.student_name.trim().toLowerCase().includes(searchString.toLowerCase())
				);
			}
		}
	} catch (error) {
		console.warn(`[getUserList] error: ${error}`);
	}

	return validResult;
};

export const fetchSpreadsheet = async (
	SpreadSheetID: string | undefined,
	token: string | undefined
) => {
	const fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}`;

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.get(fetchURL, headers);
		return response.data;
	} catch (err) {
		console.warn("[fetchSpreadSheet] Error: " + err);
	}
};

export const updateUserAPI = async (
	SpreadSheetID: string | undefined,
	token: string | undefined,
	data: UpdateFormData
) => {
	const valueInputOptions = "USER_ENTERED";
	const row = data.keys + 2;
	const Range = `student_table!A${row}:B${row}`;
	const AppendURL = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}/values/${Range}?valueInputOption=${valueInputOptions}`;

	const values = [[data.octopus_id, data.student_name]];

	const body = {
		range: Range,
		values: values,
	};

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.put(AppendURL, body, headers);
		return response.data;
	} catch (err) {
		console.warn("[updateUser] error: " + err);
	}
};

export const getSheetId = async (spreadSheetInfo: any) => {
	let sheetId = "";
	for (const element of spreadSheetInfo.sheets) {
		if (element.properties.title == "student_table") {
			sheetId = element.properties.sheetId;
		}
	}

	return sheetId;
};

export const deleteUserAPI = async (
	sheetId: string,
	row: number,
	SpreadSheetID: string | undefined,
	token: string | undefined
) => {
	const requests = [
		{
			deleteDimension: {
				range: {
					sheetId: sheetId,
					dimension: "ROWS",
					startIndex: row - 1,
					endIndex: row,
				},
			},
		},
	];

	console.log(JSON.stringify({ requests }));

	const deleteURL = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}:batchUpdate`;

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.post(deleteURL, JSON.stringify({ requests }), headers);
		console.log(response.data);
	} catch (err) {
		console.warn("[deleteUserAPI] Error: ", err);
	}
};

export const AppendAPI = async (
	SpreadSheetID: string | undefined,
	Range: string,
	values: any[],
	token: string | undefined
) => {
	const valueInputOptions = "USER_ENTERED";
	const AppendURL = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}/values/${Range}:append?valueInputOption=${valueInputOptions}`;

	const body = {
		range: Range,
		values: values,
	};

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.post(AppendURL, body, headers);
		console.log(response.data);
	} catch (err: any) {
		console.warn("[AppendWorkSheet] err: ", err);
	}
};

export const CheckInAPI = async (SpreadSheetID: string | undefined, token: string | undefined) => {
	const Range = "checkIn_table!A2:E";
	const CheckInUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}/values/${Range}`;

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
	};

	try {
		const response = await axios.get(CheckInUrl, headers);
		return response;
	} catch (err) {
		console.warn("[CheckinAPI] Error: ", err);
	}
};

export const UserDataAPI = async (SpreadSheetID: string | undefined, token: string | undefined) => {
	const Range = "student_table!A2:E";
	const UserURL = `https://sheets.googleapis.com/v4/spreadsheets/${SpreadSheetID}/values/${Range}`;

	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
	};

	try {
		const response = await axios.get(UserURL, headers);
		return response;
	} catch (err) {
		console.warn("[UserDataAPI] Error: ", err);
	}
};
