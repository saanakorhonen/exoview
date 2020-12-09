import React from 'react';
import { View, Text } from 'react-native';
import Starcolor from './Starcolor';

const BallAndName = ({ pName, pSize = 10, flex, top, temp }) => {
	//console.log(temp);
	return (
		<View
			style={{
				flex: flex,
				flexDirection: 'row',
				width: 200,
				top: -pSize / 2,
				left: -pSize / 2,
			}}>
			<View
				style={{
					width: pSize,
					height: pSize,
					borderRadius: 50,
					marginRight: 10,
					backgroundColor: Starcolor(temp),
				}}></View>
			<Text style={{ color: 'white', top: top, width: 100, fontSize: 12 }}>
				{pName}
			</Text>
		</View>
	);
};

export default BallAndName;
