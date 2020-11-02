import React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
import PlanetDistanceComparison from "../components/PlanetDistanceComparison";
import OrbitView from "../components/OrbitView";

const Distance = ({ route }) => {
	console.log("const dist", route.params.planet);
	const planet = route.params.planet;
	return (
		<View style={styles.container}>
			<View style={styles.distanceBox}>
				<PlanetDistanceComparison planet={planet} />
			</View>
			<View style={styles.infoBox}>
				<View style={styles.infoBox}>
					<Text style={styles.infoBoxTitle}>{planet.pname}</Text>
					<Text style={styles.infoBoxContent}>
						{planet.pname} has a
						<Text
							style={{ color: "lightblue" }}
							onPress={() => {
								alert(
									"The Semimajor axis is the distance from the center of an ellipse to its farthest edge. It can also be thought of as a rough estimate of the average distance of the planet from its host star."
								);
							}}>
							{" "}
							semimajor axis{" "}
						</Text>
						of{" "}
						<Text style={{ color: "yellow" }}>{planet.pl_orbsmax + " "}</Text>
						<Text
							style={{ color: "lightblue" }}
							onPress={() => {
								alert(
									"An astronomical unit (AU) is 149,597,900km, or roughly the average distance of the Earth from the sun."
								);
							}}>
							AU
						</Text>
						.
					</Text>
					<Text style={styles.infoBoxContent}>
						It completes a full orbit around its host star every{" "}
						<Text style={{ color: "yellow" }}>{planet.pl_orbper}</Text> days, or once every
						<Text style={{ color: "yellow" }}> {(planet.pl_orbper/365).toFixed(2)}</Text> Earth years.
					</Text>
					<Text style={styles.infoBoxContent}>
						{planet.pname}'s orbit has an{" "}
						<Text
							style={{ color: "lightblue" }}
							onPress={() => {
								alert(
									"Eccentricity is a measure of how elliptical the orbit is, with 0 being perfectly circular and getting more elliptical as it approaches 1."
								);
							}}>
							eccentricity
						</Text>{" "}
						of <Text style={{ color: "yellow" }}>{planet.pl_orbeccen}</Text>, making it
						more/less elliptical than Earth's orbit.
					</Text>
				</View>
				<OrbitView eccentricity={planet.pl_orbeccen}></OrbitView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "black",
		justifyContent: "center",
	},
	distanceBox: {
		flex: 2,
		//width: Dimensions.get('window').width /2,
	},
	infoBox: {
		flex: 3,
		//width: Dimensions.get('window').width /2,
		backgroundColor: "black",
	},
	infoBoxTitle: {
		fontSize: 30,
		margin: 10,
		color: "white",
	},
	infoBoxContent: {
		marginLeft: 10,
		marginRight: 20,
		marginBottom: 8,
		color: "white",
		fontSize: 20,
	},
});

export default Distance;
