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

  const [loading, setLoading] = useState(true)
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
    }
  })

  useEffect(() => {
    if (route.params !=undefined) {
      const p = route.params
      setPlanet({ planet: { hostname: p.hostname, pl_name: p.pl_name, pl_rade: p.pl_rade, pl_masse: p.pl_masse, pl_massj: p.pl_bmassj, pl_radj: p.pl_radj, pl_orbsmax: p.pl_orbsmax, pl_orbper: p.pl_orbper, pl_orbeccen: p.pl_orbeccen, disc_year: p.disc_year }})
      setLoading(false)
      return
    }
    fetcPlanet();
  },[])

  // haetaan 1 planeetan tiedot
  const fetcPlanet = async () => {
    const res = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+1+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+where+disc_year+=+2020')
    const teksti = await res.text()
    const obj = await parse(teksti)
    // varsinainen haluttu data taulukkossa
    const objArray = obj.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR.TD
    // asetetaan planeetan tiedot
    setPlanet({ planet: { hostname: objArray[0], pl_name: objArray[1], pl_rade: objArray[2], pl_masse: objArray[3], pl_massj: objArray[4], pl_radj: objArray[5], pl_orbsmax: objArray[6], pl_orbper: objArray[7], pl_orbeccen: objArray[8], disc_year: objArray[9] }})
    setLoading(false)
  }

  console.log('Information ennen return', planet)
  return (
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
  )

}

//TODO: siisti!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1D32',
  },
  nameBox: {
    flex: 0.2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgba(82, 113, 255, 0.7)',
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
    margin: 20
  },
  button:{
    backgroundColor:'#134261',
    padding: 20,
  }
})

        
         {/**navigoidaan visualisaatioihin 
          *           <View style={styles.visualisationButton}>
            </View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Visualisation',planet)}>
            <Text style={{color: '#fff'}}>Open visualisation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Distance',planet)}>
            <Text style={{color: '#fff'}}>Open visualisation</Text>
          </TouchableOpacity> */}

export default Information;