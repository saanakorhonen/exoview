import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import { Image, ActivityIndicator, StyleSheet, Text, View, Button, ImageBackground } from 'react-native';
import { parse } from 'fast-xml-parser';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';


//luo päävalikko componentin  order+by+
//saa argumenttina tuon navigaation jotta pystytään kulkemaan screeneistä toiseen 
const Mainmenu = ({ navigation }) => {
  // Jos hakee tällä: https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+ps+where+disc_year+=+2020+and+default_flag+=+1+order+by+disc_pubdate+desc
  // jossa siis huomioitu publication date (hakee ps data basesta), niin tulee paljon tyhjää, eli backissä pitää ehkä katsoa miten niitä tietoja saa siistittyä ja yhdistettyä
  // nyt alla oleva on pscomppars, missä siis ei tyhjiä, mutta ei myöskääm discovery publicity datea
  var defaultUrl = 'http://172.20.10.2:8080/search?from=planets' //https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+200+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+where+disc_year+=+2020' //order+by+disc_year+desc'
  const [foundPlanets, setFoundPlanets] = useState([]) 
  const [loading, setLoading] = useState(true)

  //Aloittaa hakemalla datan
  useEffect(() => {
    console.log('Mainmenu.js:23 täällä');
    if (loading) {
      fetchData(defaultUrl)
      /*.then((data) => {
        const arr = setPlanets(data)
        setFoundPlanets(arr);*/
      }
    
  }, []);

  //Hakee default-datan tässä vaiheessa
  const fetchData = async ( props ) => {
    const response = await fetch(props);

    const objects = await response.json();
    //const objects = await parse(teksti);

    //console.log(objects);
    setFoundPlanets(objects)
    setLoading(false)
    
    //console.log('Mainmenu.js:29 foundPlanets length: ', foundPlanets.length)
    console.log('Loading: ', loading)
    /*
    const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
    //console.log('täällä Mainmenu fetchdatassa')
    return new Promise((resolve, reject) => {
        var success = planetArray != undefined;
        success ? resolve(planetArray) : reject('Query failed');
    })*/
  }
 
  const setPlanets = (arr) => {
    let arrayP = []
    arr.map(obj => {
        const planet = obj.TD
        const propPlanet =
        {
            hostname: planet[0],
            pl_name: planet[1],
            pl_rade: planet[2],
            pl_masse: planet[3],
            pl_bmassj: planet[4],
            pl_radj: planet[5],
            pl_orbsmax: planet[6],
            pl_orbper: planet[7],
            pl_orbeccen: planet[8],
            disc_year: planet[9]
        }
        arrayP = arrayP.concat(propPlanet)
    })
    return arrayP
};

console.log('mainmenu 78',foundPlanets.length)

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
              <TouchableOpacity style={styles.nappi} onPress = { () => navigation.navigate('Information', foundPlanets) }>
                <Text style={styles.text}>Recent planet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nappi} onPress = { () => navigation.navigate('Search', foundPlanets) }>
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