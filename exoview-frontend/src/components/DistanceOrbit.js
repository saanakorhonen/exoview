import React from "react";
import { View, Dimensions} from "react-native";

const DistanceOrbit = ({ height }) => {
    return (
		<View style={{flexDirection:'row',marginLeft:Dimensions.get('window').width / 4,}}>
            <View style={ {
				height: height,
				borderColor: "yellow",
				borderWidth: 1.0,
				borderStyle: "dotted",
			}}></View>
		</View>
    )
}

export default DistanceOrbit