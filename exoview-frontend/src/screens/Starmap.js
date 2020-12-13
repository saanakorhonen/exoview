import 'react-native-gesture-handler';
import React, { useState } from 'react';
import BallAndName from '../components/BallAndName';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';


//var degrees = 5;
var decRef;
var raRef;

//luo about componentin
const Starmap = ({ route }) => {
	const [degrees, setDegrees] = useState(2);
	//console.log(route.params.allPlanets);
	decRef = route.params.decRef;
	raRef = route.params.raRef;
	let combo = [].concat(route.params.hostinfo, presetStars);

	console.log(combo)
	return (
		<View
			style={{
				height: Dimensions.get('window').height,
				width: WW(),
				backgroundColor: 'black',
			}}>
			<View
				style={{
					height: WW(),
					width: WW(),
					backgroundColor: 'black',
				}}>
				<ImageBackground
					style={styles.img}
					source={require('../../assets/background.png')}>
					<View
						style={{
							left: WW() / 2,
							top: WW() / 2,
							position: 'absolute',
						}}>
						<BallAndName
							pName={route.params.name}
							pSize={2}
							flex={3}
							top={-8}
							temp={route.params.temp}
						/>
					</View>
					{combo.map((item) => (
						<View key={generateKey()}>
							<View
								style={{
									left: relativeRa(item.ra, degrees),
									top: relativeDec(item.dec, degrees),
									position: 'absolute',
								}}>
								<BallAndName
									pName={item.name}
									pSize={2}
									flex={3}
									top={-8}
									temp={item.temp}
								/>
							</View>
						</View>
					))}
				</ImageBackground>
			</View>
			<View style={styles.container}>
				<Text style={styles.text}>
					View is currently {degrees * 2} degrees across
				</Text>
			</View>
			<View style={{ flex: 1, flexDirection: 'row' }}>
				<TouchableOpacity
					style={styles.button}
					onPress={() =>
						degrees > 90 ? setDegrees(degrees) : setDegrees(degrees * 2)
					}>
					<Text style={styles.buttonText}>Zoom out</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setDegrees(degrees / 2)}>
					<Text style={styles.buttonText}>Zoom in</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const generateKey = () => {
    const keys = '1234567890abcdefghijklmnopqrstuvwxyz'
    const idLength = 10
    let i = 0;
    let id = '';
    while (i < idLength) {
        id = id + keys.charAt(Math.floor(Math.random() * Math.floor(keys.length)))
        i++;
    }
    return id;
}

const WW = () => {
	return Dimensions.get('window').width;
};

function relativeDec(dec, degrees) {
	let diff = -(dec - decRef);
	if (diff > 90) diff = -(180 - dec - decRef);
	if (diff < -90) diff = -(180 + dec - decRef);
	return WW() / 2 + (WW() / 2) * (diff / degrees);
}

function relativeRa(ra, degrees) {
	let diff = -(ra - raRef);
	if (diff > 180) diff = -(360 - ra - raRef);
	if (diff < -180) diff = -(360 + ra - raRef);
	return WW() / 2 + (WW() / 2) * (diff / degrees);
}

const styles = StyleSheet.create({
	button: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'rgb(10,10,30)',
	},
	buttonText: {
		color: 'white',
		fontSize: 20,
		top: 80,
	},
	container: {
		alignItems: 'center',
	},
	img: {
		flex: 1,
		resizeMode: 'cover',
		height: WW(),
		overflow: 'hidden',
	},
	text: {
		color: 'white',
		fontSize: 18,
	},
});

export default Starmap;

const presetStars = [
	{
		name: 'Sirius',
		dec: -16.71612,
		ra: 101.28,
		temp: 9940,
	},
	{
		name: 'Canopus',
		dec: -52.69566,
		ra: 95.99,
		temp: 7400,
	},
	{
		name: 'Alpha Centauri',
		ra: 219.9,
		dec: -60.83753,
		temp: 5790,
	},
	{
		name: 'Arcturus',
		ra: 213.92,
		dec: 19.18222,
		temp: 4286,
	},
	{
		name: 'Betelgeuse',
		ra: 88.79,
		dec: 7.407064,
		temp: 3600,
	},
	{
		name: 'Meissa',
		ra: 83.78,
		dec: 9.934156,
		temp: 37689,
	},
	{
		name: 'Bellatrix',
		ra: 81.28,
		dec: 6.349703,
		temp: 22000,
	},
	{
		name: 'Alnitak',
		ra: 85.18969,
		dec: -1.9428,
		temp: 29500,
	},
	{
		name: 'Alnilam',
		ra: 84.05333333333,
		dec: -1.201917,
		temp: 27500,
	},
	{
		name: 'Mintaka',
		ra: 83.001666,
		dec: -0.2990951,
		temp: 25600,
	},
	{
		name: 'Saiph',
		ra: 86.94,
		dec: -9.669605,
		temp: 26500,
	},
	{
		name: 'Rigel',
		ra: 78.634467,
		dec: -8.201638,
		temp: 12100,
	},
	{
		name: 'Vega',
		ra: 279.2347,
		dec: 38.78368,
		temp: 9600,
	},
	{
		name: 'Capella',
		ra: 79.17232,
		dec: 45.99799,
		temp: 4970,
	},
	{
		name: 'Procyon',
		ra: 114.82549,
		dec: 5.224987,
		temp: 6530,
	},
	{
		name: 'Achernar',
		ra: 24.4285,
		dec: -57.23675,
		temp: 15000,
	},
];
