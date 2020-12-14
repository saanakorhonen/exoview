import React, { useState, useEffect } from 'react'
import { ImageBackground, ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, Dimensions,  } from 'react-native'
//import { MaterialIcons } from '@expo/vector-icons';
import InfoView from '../components/InfoView';
import { ScrollView } from 'react-native-gesture-handler';
import Visualisation from '../screens/Visualisation'
import Distance from '../screens/Distance'
import exoService from '../services/exoplanets'

const Information = ({ navigation, route }) => {
  const screenWidth = Dimensions.get('window').width
  const [system, setSystem] = useState()
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [planetsSet, setPlanetsSet] = useState()
  
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
    setPlanetsSet(false)
    // tänne,kun tullaan searchchista view planet
    if (route.params.planet !== undefined) {
      const p = route.params.planet
      setPlanet({ planet: { hostname: p.hostname, pl_name: p.pl_name, pl_rade: p.pl_rade, pl_masse: p.pl_masse, pl_massj: p.pl_bmassj, pl_radj: p.pl_radj, pl_orbsmax: p.pl_orbsmax, pl_orbper: p.pl_orbper, pl_orbeccen: p.pl_orbeccen, disc_year: p.disc_year }})
      setSystem(route.params.system)
      setLoading(false)
      return
    }
    // tänne, kun tukkaa stellar viewsta
    const p = route.params[0]
    setPlanets(route.params)
    setPlanet({ planet: { hostname: p.hostname, pl_name: p.pl_name, pl_rade: p.pl_rade, pl_masse: p.pl_masse, pl_massj: p.pl_bmassj, pl_radj: p.pl_radj, pl_orbsmax: p.pl_orbsmax, pl_orbper: p.pl_orbper, pl_orbeccen: p.pl_orbeccen, disc_year: p.disc_year }})  
    setPlanetsSet(true) // tästä hyppää 'useEffect 2' laittamaan tähtijärjestelmän
  },[])
  
  useEffect(() => {
    //tänne, kun tullaan main menusta suoraan
    if(planetsSet === true){
    const nimi = planet.planet.hostname
    exoService.getStellarSystem(nimi)
    .then((star) => {
      var tahdenplaneetat = planets.filter(planet => planet['hostname'].match(star.hostname))
      const system = {star: star, planets: tahdenplaneetat}   
      setSystem(system)
      setLoading(false)
    })}
  }, [planetsSet])

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
              <TouchableOpacity  style ={styles.visualisationButton} onPress = { () => navigation.navigate('Stellar System', system) }>
                <Text style={styles.buttonText}>Stellar System view</Text>
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