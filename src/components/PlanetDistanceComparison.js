"use strict";
import React, { useState } from "react";
import { Text, View, Dimensions, StyleSheet, SafeAreaView } from "react-native";
import BallAndName from './BallAndName';

/*
var starRadius = 10;
var maxDistance = 1;
const earthAU = 1;
*/

const PlanetDistanceComparison = ({ planet }) => {

  const length = 1; // maksimietäisyys

  // jos maa lähinnä, niin suhteutetaan maksimietäisyys exoplaneetan obsmax:n mukaan
  let closest = 'Earth';
  let farthest = planet.pname;
  let closestFlex = length/planet.pl_orbsmax;
  let farthestFlex = length-closestFlex;

  // jos eksoplaneetan etäisyys tähdestä pienempi kuin 1 (eli Maan etäisyys Auringosta), 
  // niin asetetaan Maa kauimmaksi planeetaksi
  if( planet.pl_orbsmax < 1) {
    closest = planet.pname;
    farthest = 'Earth';
    farthestFlex = length-planet.pl_orbsmax
    closestFlex = planet.pl_orbsmax
  }

	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "flex-start",
        backgroundColor: "black",
        marginLeft: 20,
			}}>
			<View style={styles.line}>
        <BallAndName pName={planet.hname} pSize={30} flex={closestFlex} top={5} />
        <BallAndName pName={closest} pSize={10} flex={farthestFlex} top={-5} />
        <BallAndName pName={farthest} pSize={10} flex={0} top={-5} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	line: {
		position: "absolute",
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

export default PlanetDistanceComparison;
