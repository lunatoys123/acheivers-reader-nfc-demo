import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import AuthReducer from "@/Redux/Auth/AuthSlice";
import devtoolsEnhancer from "redux-devtools-expo-dev-plugin";

export const store = configureStore({
	reducer: {
		Auth: AuthReducer,
	},
	devTools: false,
	enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devtoolsEnhancer()),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
