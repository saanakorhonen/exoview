import React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";

const DistanceOrbit = () => {
    return (
            <View style={styles.line}></View>
			
        
    )
}

const styles = StyleSheet.create({
	line: {
        flex: 1,
        //alignItems:'center',
        //justifyContent:'center',
		//position: "absolute",
		width: 1,
		height: Dimensions.get("window").height * 5 / 6,
		borderWidth: 1,
		borderRadius: 1.0,
		borderColor: "yellow",
    borderStyle: "dotted"
	},
	text: {
		color: "white",
	},
});

export default DistanceOrbit