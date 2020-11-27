import React, { useState, useEffect } from 'react'
import { ImageBackground, ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, Dimensions,  } from 'react-native'
//import { MaterialIcons } from '@expo/vector-icons';
import { parse } from 'fast-xml-parser';
import InfoView from '../components/InfoView';
import { ScrollView } from 'react-native-gesture-handler';
import Visualisation from '../screens/Visualisation'
import Distance from '../screens/Distance'

const Information = ({ navigation, route }) => {
  const screenWidth = Dimensions.get('window').width
  const [system, setSystem] = useState()
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [planetsSet, setPlanetsSet] = useState(false)
  // alussa tyhjä alustus
  const [planet, setPlanet] = useState({
    planet: {
      hostname: '',
      pl_name: '',
      pl_rade: '',
      pl_masse: '',
      pl_massj: '',
      pl_radj:'',
      disc_year: ''
    },
  })

  useEffect(() => {
    if (route.params.planet !=undefined) {
      console.log('infossa useEffect if',route.params)
      const p = route.params.planet
      setPlanet({ planet: { hostname: p.hostname, pl_name: p.pl_name, pl_rade: p.pl_rade, pl_masse: p.pl_masse, pl_massj: p.pl_bmassj, pl_radj: p.pl_radj, pl_orbsmax: p.pl_orbsmax, pl_orbper: p.pl_orbper, pl_orbeccen: p.pl_orbeccen, disc_year: p.disc_year }})
      setSystem(route.params.system)
      setLoading(false)
      return
    }
    const p = route.params[0]
    setPlanets(route.params)
    setPlanet({ planet: { hostname: p.hostname, pl_name: p.pl_name, pl_rade: p.pl_rade, pl_masse: p.pl_masse, pl_massj: p.pl_bmassj, pl_radj: p.pl_radj, pl_orbsmax: p.pl_orbsmax, pl_orbper: p.pl_orbper, pl_orbeccen: p.pl_orbeccen, disc_year: p.disc_year }})  
    setPlanetsSet(true)
  },[])
  
  useEffect(() => {
    const nimi = planet.planet.pl_name;
    const kutsu = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+1+st_spectype,st_teff,st_rad,st_mass,st_age,st_rotp+from+pscomppars+where+pl_name+like+\'"+nimi+"\'+order+by+disc_year+desc";
    fetchData(kutsu)
    .then((data) =>{
        var star = setStars(data,planet.planet.hostname)
        var tahdenplaneetat = planets.filter(planet => planet['hostname'].match(star.hostname))
        const system = {star: star, planets: tahdenplaneetat}   
        setSystem(system)
        setLoading(false)
    }).catch((error) => console.log('error fetcData')) 

  }, [planetsSet])

  const fetchData = async ( props ) => {
    const response = await fetch(props);
    const teksti = await response.text();
    const objects = await parse(teksti);
    const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
    return new Promise((resolve, reject) => {
        var success = planetArray != undefined;
        success ? resolve(planetArray) : reject('Query failed');
    })
  } 
  
  const setStars = (arr,data) => {
    const star = arr.TD
    const propPlanet =
      {
        hostname: data,
        st_spectype: star[0],
        st_teff: star[1],
        st_rad: star[2],
        st_mass: star[3],
        st_age: star[4],
        st_rotp: star[5]
      }
    return propPlanet
  }

console.log('system', system)
  return (
    <ImageBackground style={styles.container} source={require('../../assets/background.png')} >
    <View style={styles.container}>
      {loading
      ? <ImageBackground style={{flex: 1, alignItems: 'center', justifyContent:'flex-end'}} source={require('../../assets/exoView_opening_pic.png')}>
          <ActivityIndicator size='large' color='rgba(255,255,255, 0.4)' />
          <Text style={{padding: 10, marginBottom: 50, color:'rgba(255,255,255, 0.4)'}}>Loading</Text>
          <Text style={{padding: 10,color:'rgba(255,255,255, 0.2)'}}>Eksolaakson tarinoita 2020</Text>
        </ImageBackground>
      :(
      <ScrollView
        horizontal={true}>
          <View style={{ width: screenWidth}}>
            <View style={styles.nameBox}>
              <Text style={styles.name}>{planet.planet.pl_name}</Text>
            </View>
            <View style={styles.infoBox}>
           {/**detaljeet, informaatio datat */}
              <InfoView data={planet.planet}/>
              <TouchableOpacity  style ={styles.visualisationButton} onPress = { () => navigation.navigate('StarSystem', system) }>
                <Text style={styles.buttonText}>Starsystem view</Text>
              </TouchableOpacity>
            </View >
        </View>
        <View style={{ flex: 1, width: screenWidth, marginRight: 10}}>
          <Visualisation planet={planet.planet} />
        </View>
        <View style={{ width: screenWidth}}>
          <Distance eplanet={planet.planet} />
        </View>
      </ScrollView>
      )}

    </View>  
    </ImageBackground> 
  )
}

//TODO: siisti!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#0E1D32',
  },
  nameBox: {
    flex: 0.2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgba(82, 113, 255, 0.5)',
    borderWidth:1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius:30
  },
  infoBox: {
    flex: 0.75,
  }, 
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#ffff',
  },
  visualisationButton: {
    flexDirection: 'row',
    justifyContent:'center',
    backgroundColor:'rgba(82, 113, 255, 0.5)',
    padding: 20,
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonText:{
    color:'white',
    //fontWeight:'bold',
    fontSize: 18
  }
})

export default Information;