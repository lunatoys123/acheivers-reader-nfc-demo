import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";
import { SignInFunc } from "@/utils/API/UserFunc";

export interface UserState {
	token: string | undefined;
	status: "idle" | "loading" | "failed";
	errorText: string;
}

const initialState: UserState = {
	token: "",
	status: "idle",
	errorText: "",
};

export const AuthSlice = createSlice({
	name: "Auth",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(SignInFunc.pending, state => {
				state.status = "loading";
			})
			.addCase(SignInFunc.fulfilled, (state, action) => {
				state.status = "idle";
				state.token = action.payload;
			});
	},
});

export const Auth = (state: RootState) => state.Auth;

export default AuthSlice.reducer;
