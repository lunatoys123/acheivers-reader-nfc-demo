import { View, TextInput, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Button, Icon } from "@rneui/base";

type SearchAreaProps = {
	searchString: string;
	setSearchString: Dispatch<SetStateAction<string>>;
	getUserList: (searchString: string) => Promise<void>;
	token: string | undefined;
};

const SearchArea = (props: SearchAreaProps) => {
	const { searchString, setSearchString, getUserList, token } = props;
	return (
		<View style={styles.searchLayout}>
			<Icon
				name="search"
				type="Feather"
			/>
			<TextInput
				placeholder="Enter your search"
				style={styles.input}
				onChangeText={value => {
					setSearchString(value);
					getUserList(value);
				}}
				value={searchString}
				editable={token != null && token.length > 0}
			/>
			{searchString != null && searchString.length > 0 && (
				<Button
					title="x"
					type="clear"
					titleStyle={styles.resetButton}
					onPress={()=>{
						setSearchString("");
                        getUserList("");
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	searchLayout: {
		width: "100%",
		flexDirection: "row",
		padding: 10,
		backgroundColor: "white",
		gap: 5,
		alignItems: "center",
	},
	resetButton: {
		color: "red",
	},
	input: { width: "80%", height: 40 }
});

export default SearchArea;
