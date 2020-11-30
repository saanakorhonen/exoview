"use strict";
import React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";

let fColor = "lightblue";
let bColor = "lightblue";

/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function Stars({ star }) {
	console.log('Stars.js:16 ', star.st_rad);
	/*
  let relativeSize = 1.0;
  exoSize = props.planet.pl_rade;

  if (isNaN(props.planet.pl_rade)) {
    exoSize = 1.0;
  }
*/

	const starSunRel = (star?.st_rad ?? 1.0) / 1.0;

	const bStar = {
		name: "",
		color: "",
		teff: "",
		relativeSize: -1,
	};

	const fStar = {
		name: "",
		color: "",
		teff: "",
		relativeSize: -1,
	};

	if (starSunRel > 1) {
		bStar.color = starColor(star?.st_teff ?? 5772);
		bStar.relativeSize = 1.0;
		bStar.name = star.hostname;
		bStar.teff = star?.st_teff ?? 'unknown';

		fStar.relativeSize = 1 / starSunRel;
		fStar.color = starColor(5772);
		fStar.name = "Sun";
		fStar.teff = 5772;
		//padding = (WW() - (WW() * relativeSize)) / 2;
	} else {
		bStar.color = starColor(5772);
		bStar.relativeSize = 1.0;
		bStar.name = "Sun";
		bStar.teff = 5772;

		fStar.color = starColor(star?.st_teff ?? 5772);
		fStar.relativeSize = star?.st_rad ?? 1.0;
		fStar.name = star.hostname;
		fStar.teff = star?.st_teff ?? 'unknown';

		// padding = (WW() - (WW() * relativeSize)) / 2;
	}

	console.log('Stars.js:67 ', bStar.color);
	return (
		<View style={{ flexDirection: "row"}}>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<View
					style={{
						position: "relative",
						backgroundColor: bStar.color,
						height: WW() * bStar.relativeSize,
						width: WW() * bStar.relativeSize,
						borderRadius: 1000,
						borderColor: "grey",
						borderWidth: 1,
					}}></View>
				{/** front star */}
				<View
					style={{
						position: "absolute",
						backgroundColor: fStar.color,
						height: WW() * fStar.relativeSize,
						width: WW() * fStar.relativeSize,
						borderRadius: 1000,
						borderColor: "grey",
						borderWidth: 1,
					}}></View>
			</View>
			<View
				style={{
					flex: 1,
					height: Dimensions.get("window").width / 2,
					marginHorizontal: 10,
					justifyContent:'center'
				}}>	
				<Text style={styles.title}>{star.hostname}</Text>
				<Text style={styles.paragraph}>
				    {star.hostname} has {star.st_rad} radius of the sun and {star.st_mass} mass of the sun.
					It has the stellar age of {star.st_age} and {star.st_teff} K hot. The star spins around its own axis in {star.st_rotp} days.
				</Text>
				{/*<Text style={styles.paragraph}>
					The Star shown behind is {bStar.name}. It's stellar effective
					temperature is {bStar.teff} K. The star infront is {fStar.name} and
					it's stellar effective temperature is {fStar.teff}
				   </Text> */}
			</View>
		</View>
	);
}

/**
 *
 * @param { <Planet relative={relativeSize}></Planet>
 */
function starColor(temp) {
	if (temp < 3500) return "red";
	else if (temp < 5000) return "orange";
	else if (temp < 8000) return "yellow";
	else if (temp < 20000) return "white";
	return "blue";
}

/**
 * Ottaa ikkunan leveydestä jonkun murto-osan
 */
function WW() {
	let ww = Dimensions.get("window").width / 2;
	return ww;
}

const styles = StyleSheet.create({
	paragraph: {
		color: "white",
	},
	title: {
		color: "white",
		fontSize: 20,
		fontWeight: "700",
	},
});
