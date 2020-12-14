import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Navigator from './src/routes/infoVisualisationStack';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
	return (
		<NavigationContainer>
			<Navigator />
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',

	},
});
