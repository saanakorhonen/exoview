import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Information from '../screens/Information'
import Visualisation from '../screens/Visualisation'
import Mainmenu from '../screens/Mainmenu'
import Search from '../screens/Search'
import About from '../screens/About'

const Stack = createStackNavigator();
//stack navigaatio plneetan infosta planeetan visualisaatioihin
function InfoVisualisationStack() {
  return (
    <Stack.Navigator>
	    <Stack.Screen name="Mainmenu" component={Mainmenu} />
      <Stack.Screen name="Information" component={Information} />
      <Stack.Screen name="Visualisation" component={Visualisation} />
	    <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}

export default InfoVisualisationStack