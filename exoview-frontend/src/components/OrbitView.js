"use strict";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

//var ecc = 0.1;
//var sminax = Math.sqrt(1 - ecc * ecc);
const ballRadius = 5;

const OrbitView = ({ eccentricity }) => {
	let ecc = 0.5;
	ecc = eccentricity;
	let sminax = Math.sqrt(1 - ecc * ecc);

	return (
		<View
			style={{
				flex: 2,
				justifyContent: "center",
				alignItems: "center",
			}}>
			<View style={styles.orbit(sminax)}>
				<View style={styles.ball(ecc, sminax)}></View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	orbit: (sminax) => ({
		width: 200,
		flexDirection: "row",
		height: 200,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: "white",
		transform: [{ scaleY: sminax }],
		justifyContent: "center",
		alignItems: "center",
	}),
	ball: (eccentricity, sminax) => ({
		width: ballRadius,
		height: ballRadius,
		left: -100 * eccentricity,
		borderRadius: ballRadius / 2,
		backgroundColor: "yellow",
		transform: [{ scaleY: 1 / sminax }],
	}),
});

export default OrbitView;
