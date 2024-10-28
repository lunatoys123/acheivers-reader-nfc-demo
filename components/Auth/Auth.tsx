import React from "react";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAppDispatch } from "@/hook";

import { SignInFunc } from "@/utils/API/UserFunc";

const Auth = () => {
	const WebClientId = process.env.EXPO_PUBLIC_WebClientId;

	const dispatch = useAppDispatch();

	GoogleSignin.configure({
		scopes: [
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/drive.file",
			"https://www.googleapis.com/auth/spreadsheets",
		],
		webClientId: WebClientId,
		forceCodeForRefreshToken: true,
	});

	return (
		<GoogleSigninButton
			size={GoogleSigninButton.Size.Wide}
			color={GoogleSigninButton.Color.Dark}
			onPress={() => dispatch(SignInFunc())}
		/>
	);
};

export default Auth;
