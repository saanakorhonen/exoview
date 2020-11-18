import React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";

const DistanceOrbit = ({ height }) => {
    return (
            <View style={ {
				height: height,
				borderColor: "yellow",
				borderWidth: 1.0,
				borderStyle: "dotted"
			}}></View>
			
        
    )
}

const styles = StyleSheet.create({
	line: {
        flex: 1,
        //alignItems:'center',
        //justifyContent:'center',
		//position: "absolute",
		width: 1,
		height: 122,
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