import { View, TextInput , StyleSheet} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Icon } from "@rneui/base";

type RecordSearchProps = {
	setSearchText: Dispatch<SetStateAction<string>>;
    ObtainRecord: () => Promise<void>;
    setAdvancedSearch: Dispatch<SetStateAction<boolean>>;
};

const RecordSearchArea = (props: RecordSearchProps) => {
	const { setSearchText, ObtainRecord, setAdvancedSearch } = props;
	return (
		<View style={styles.searchLayout}>
			<View style={styles.searchContainer}>
				<Icon
					name="search"
					type="feather"
				/>
				<TextInput
					placeholder="Search Record"
					style={styles.input}
					onChangeText={value => setSearchText(value)}
					onSubmitEditing={() => ObtainRecord()}
				/>
				<Icon
					name="more-horizontal"
					type="feather"
					containerStyle={{ paddingRight: 10 }}
					onPress={() => setAdvancedSearch(true)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
    searchLayout: { backgroundColor: "white", paddingVertical: 10 },
    searchContainer: { flexDirection: "row", alignItems: "center", paddingLeft: 10 },
    input: { height: 40, flex: 1 }
});

export default RecordSearchArea;
