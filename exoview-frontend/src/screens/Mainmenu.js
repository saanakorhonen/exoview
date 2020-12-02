import 'react-native-gesture-handler';
import React, {useState, useEffect } from 'react';
import exoService from '../services/exoplanets'
import { Image, ActivityIndicator, StyleSheet, Text, View,ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

const Mainmenu = ({ navigation }) => {
  const [exoplanets, setExoplanets] = useState([]) 
  const [loading, setLoading] = useState(true)

  //Aloittaa hakemalla datan
  useEffect(() => {
    console.log('Mainmenu.js:23 täällä');
    if (loading) {
      exoService.getAllExo()
      .then((planets) => {
        setExoplanets(planets)
        setLoading(false)
      })
    }
  }, []);

console.log('mainmenu 78',exoplanets.length)

	return (
    <View style={{ flex:1, justifyContent: 'center', }}>
      {loading
      ? <ImageBackground style={{flex: 1, alignItems: 'center', justifyContent:'flex-end'}} source={require('../../assets/exoView_opening_pic.png')}>
          <ActivityIndicator size='large' color='rgba(255,255,255, 0.4)' />
          <Text style={{padding: 10, marginBottom: 50, color:'rgba(255,255,255, 0.4)'}}>Loading</Text>
          <Text style={{padding: 10,color:'rgba(255,255,255, 0.2)'}}>Eksolaakson tarinoita 2020</Text>
        </ImageBackground>
      : (<ImageBackground style={styles.container} source={require('../../assets/appname(2).png')}>
          <View style={styles.logoBox}>
            <Image style={styles.logo} source={require('../../assets/exoLogoSininen.png')} />
            <Text style={styles.textLogo}>WHAT  WOULD  YOU  LIKE  TO  EXPLORE ?</Text>
          </View>
          <View style={styles.buttonsBox}>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.nappi} onPress = { () => navigation.navigate('Information', exoplanets) }>
                <Text style={styles.text}>Recent planet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nappi} onPress = { () => navigation.navigate('Search', exoplanets) }>
                <Text style={styles.text}>Search Planets</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttons}> 
              <TouchableOpacity style={styles.nappi} onPress = { () => navigation.navigate('About') }>
                <Text style={styles.text}>About exoView</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.nappi ,backgroundColor: 'rgba(255,255,255, 0.0)'}} >
              </TouchableOpacity>
              </View>      
          </View>
          <StatusBar style="auto" />
        </ImageBackground>)}
    </View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    flex: 1/3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    height: 100,
    width: 320
  },
  buttonsBox: {
    flex: 1/2,
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'

  },
  nappi: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    margin: 10,
    backgroundColor: 'rgba(82, 113, 255, 0.7)',
    borderRadius: 10
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500'
  },
  textLogo: {
    marginLeft: 10,
    width: 310,
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  }
  
});

export default Mainmenu;