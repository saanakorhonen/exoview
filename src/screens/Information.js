import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity,  } from 'react-native'
//import { MaterialIcons } from '@expo/vector-icons';
import { parse } from 'fast-xml-parser';
import InfoView from '../components/InfoView';

const Information = ({ navigation, route }) => {


  // alussa tyhjä alustus
  const [planet, setPlanet] = useState({
    planet: {
      hname: '',
      pname: '',
      pradius: '',
      pmasse: '',
      pl_massj: '',
      pl_radj:'',
    }
  })

  useEffect(() => {
    if (route.params !=undefined) {
      const p = route.params
      setPlanet({ planet: { hname: p.hname, pname: p.pname, pradius: p.pradius, pmasse: p.pmasse, pl_massj: p.pl_bmassj, pl_radj: p.pl_radj, pl_orbsmax: p.pl_orbsmax, pl_orbper: p.pl_orbper, pl_orbeccen: p.pl_orbeccen }})
      return
    }
    fetcPlanet();
  },[])

  // haetaan 1 planeetan tiedot
  const fetcPlanet = async () => {
    const res = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+1+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen+from+pscomppars+where+disc_year+=+2020')
    const teksti = await res.text()
    const obj = await parse(teksti)
    // varsinainen haluttu data taulukkossa
    const objArray = obj.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR.TD
    // asetetaan planeetan tiedot
    setPlanet({ planet: { hname: objArray[0], pname: objArray[1], pradius: objArray[2], pmasse: objArray[3], pl_bmassj: objArray[4], pl_radj: objArray[5], pl_orbsmax: objArray[6], pl_orbper: objArray[7], pl_orbeccen: objArray[8] }})
  }

  console.log('Information ennen return', planet)
  return (
    
    <View style={styles.container}>
      <View style={styles.nameBox}>
        <Text style={styles.name}>{planet.planet.pname}</Text>
      </View>
      <View style={styles.infoBox}>
        {/**detaljeet, informaatio datat */}
        <InfoView data={planet.planet}/>
      </View >
      <View style={styles.visualisationButton}>
       {/**navigoidaan visualisaatioihin */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Visualisation',planet)}>
          <Text style={{color: '#fff'}}>Open visualisation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Distance',planet)}>
          <Text style={{color: '#fff'}}>Open visualisation</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

}


//TODO: siisti!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  nameBox: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#134261',
    borderWidth:1,
    borderColor: '#134261',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius:40
  },
  infoBox: {
    flex: 3,
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

export default Information;