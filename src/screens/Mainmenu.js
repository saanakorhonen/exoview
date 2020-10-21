import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


//luo päävalikko componentin
//saa argumenttina tuon navigaation jotta pystytään kulkemaan screeneistä toiseen
const Mainmenu = ({navigation}) => {
	return (
    <View style={styles.container}>
	  <Button style={styles.nappi} onPress = { () => navigation.navigate('Information',navigation) } title= "Planet info" /> 
	  <Button style={styles.nappi}/*onPress = { () => jotain }*/ title= "Search" /> 
	  <Button style={styles.nappi} title= "About" onPress = {() => navigation.navigate('About')}  />
      <StatusBar style="auto" />
    </View>
	);
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nappi: {
	  
  },
  
});

export default Mainmenu;