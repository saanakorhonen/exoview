import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button, ImageBackground } from 'react-native';
import { parse } from 'fast-xml-parser';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


//luo päävalikko componentin  order+by+
//saa argumenttina tuon navigaation jotta pystytään kulkemaan screeneistä toiseen
const Mainmenu = ({ navigation }) => {

  var defaultUrl =  'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+order+by+disc_year+desc'
  const [foundPlanets, setFoundPlanets] = useState([]) 
  const [loading, setLoading] = useState(true)

  //Aloittaa hakemalla datan
  useEffect(() => {
    if (loading) {
      fetchData(defaultUrl)
      .then((data) => {
        setLoading(false)
        setFoundPlanets(data);
        console.log(foundPlanets.length)
        console.log(loading)
      })
    }
  }, []);

  //Hakee default-datan tässä vaiheessa
  const fetchData = async ( props ) => {
    const response = await fetch(props);

    const teksti = await response.text();
    const objects = await parse(teksti);

    const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
    console.log('täällä Mainmenu fetchdatassa')
    return new Promise((resolve, reject) => {
        var success = planetArray != undefined;
        success ? resolve(planetArray) : reject('Query failed');
    })
}

	return (
    <View style={{ flex:1, justifyContent: 'center', }}>
      {loading
      ? <ImageBackground style={{flex: 1, alignItems: 'center', justifyContent:'flex-end'}} source={require('../../assets/exoView_opening_pic.png')}>
          <ActivityIndicator size='large' color='rgba(255,255,255, 0.4)' />
          <Text style={{padding: 10, marginBottom: 50, color:'rgba(255,255,255, 0.4)'}}>Loading</Text>
          <Text style={{padding: 10,color:'rgba(255,255,255, 0.2)'}}>exoView 2020</Text>
        </ImageBackground>
      : (<View style={styles.container}>
          <Button style={styles.nappi} onPress = { () => navigation.navigate('Information') } title= "Planet info" /> 
          <Button style={styles.nappi} onPress = { () => navigation.navigate('Search', foundPlanets) } title= "Search" /> 
          <Button style={styles.nappi} title= "About" onPress = { () => navigation.navigate('About')}  />
          <StatusBar style="auto" />
        </View>)}
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