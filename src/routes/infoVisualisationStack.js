import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Information from '../screens/Information'
import Visualisation from '../screens/Visualisation'

const Stack = createStackNavigator();
//stack navigaatio plneetan infosta planeetan visualisaatioihin
function InfoVisualisationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Information" component={Information} />
      <Stack.Screen name="Visualisation" component={Visualisation} />
    </Stack.Navigator>
  );
}

export default InfoVisualisationStack