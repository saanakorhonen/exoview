import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



//luo about componentin
const About = () => {
	return( 
	<View style={{flex:1, backgroundColor: '#0E1D32'}} >
		<View style={{flex: 0.6,margin: 10}}>
		<Text style={{color: 'white'}}>
	This is a program made to visualize data about exoplanets.
	</Text>
	<Text style={{color: 'white'}}>
	Made by:
	</Text>
	<Text style={{color: 'white'}}>
	Essi Purhonen
	</Text>
	<Text style={{color: 'white'}}>
	Lari Salminen
	</Text>
	<Text style={{color: 'white'}}>
	Saana Korhonen
	</Text>
	<Text style={{color: 'white'}}>
	Sasu Ilmo
	</Text>
	<Text style={{color: 'white'}}>
	Acknowledgements:
	</Text>
	<Text style={{color: 'white'}}>
	This research has made use of the NASA Exoplanet Archive, which is operated by the California Institute of Technology, 
	under contract with the National Aeronautics and Space Administration under the Exoplanet Exploration Program.
	</Text>
	<Text style={{color: 'white'}}>
	These data are made available to the community through the Exoplanet Archive on behalf of the KELT project team.
	</Text>
		</View>
	<View style={{ flex: 0.2, alignItems:'center'}}>
	  <Image  style={{height: 150, width: 350, marginBottom: 30}}source={require('../../assets/exoLogoText.png')} />
		<Text style={{color: 'white'}}>Eksolaakson tarinoita 2020.</Text>
	</View>
	</View>
	
	);
};

const styles = StyleSheet.create({
  
});

export default About;
