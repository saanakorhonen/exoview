import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Information from '../screens/Information';
import Visualisation from '../screens/Visualisation';
import Mainmenu from '../screens/Mainmenu';
import Search from '../screens/Search';
import About from '../screens/About';
import Distance from '../screens/Distance';
import Starsystem from '../screens/Starsystem';
import Starmap from '../screens/Starmap';

const Stack = createStackNavigator();
//stack navigaatio plneetan infosta planeetan visualisaatioihin
function InfoVisualisationStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerTintColor: 'white',
				headerStyle: { backgroundColor: '#0E1D32' },
			}}>
			<Stack.Screen
				name='Mainmenu'
				component={Mainmenu}
				options={{ headerTransparent: true, headerTitle: '' }}
			/>
			<Stack.Screen name='Information' component={Information} />
			<Stack.Screen name='Visualisation' component={Visualisation} />
			<Stack.Screen name='Distance' component={Distance} />
			<Stack.Screen name='About' component={About} />
			<Stack.Screen name='Search' component={Search} />
			<Stack.Screen name='Stellar System' component={Starsystem} />
			<Stack.Screen name='Starmap' component={Starmap} />
		</Stack.Navigator>
	);
}

export default InfoVisualisationStack;
