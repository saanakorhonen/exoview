import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



//luo about componentin
const About = () => {
	return( 
	<View>
	<Text>
	This is a program made to visualize data about exoplanets.
	</Text>
	<Text>
	Made by:
	</Text>
	<Text>
	Essi Purhonen
	</Text>
	<Text>
	Lari Salminen
	</Text>
	<Text>
	Saana Korhonen
	</Text>
	<Text>
	Sasu Ilmo
	</Text>
	<Text>
	Acknowledgements:
	</Text>
	<Text>
	This research has made use of the NASA Exoplanet Archive, which is operated by the California Institute of Technology, 
	under contract with the National Aeronautics and Space Administration under the Exoplanet Exploration Program.
	</Text>
	<Text>
	These data are made available to the community through the Exoplanet Archive on behalf of the KELT project team.
	</Text>
	</View>
	);
};

const styles = StyleSheet.create({
  
});

export default About;
