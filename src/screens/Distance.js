import React from 'react'
import { Text, View, Dimensions, StyleSheet } from "react-native";
import PlanetDistanceComparison from '../components/PlanetDistanceComparison';

const Distance = ({ route }) => {
  console.log('const dist', route.params.planet)
  const planet = route.params.planet
  return (
    <View style={styles.container}>
      <View style={styles.distanceBox}>
        <PlanetDistanceComparison planet={planet}/>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>{planet.pname}</Text>
          <Text style={styles.infoBoxContent}>
            {planet.pname} has a
            <Text style={{color: 'blue' }} onPress={() => {alert('Tässä selitys');}}> semimajor axis </Text> 
            of {planet.pl_orbsmax} AU.
          </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  distanceBox: {
    flex:2,
    //width: Dimensions.get('window').width /2,
  },
  infoBox: {
    flex:3,
    //width: Dimensions.get('window').width /2,
    backgroundColor: 'white'
  },
  infoBoxTitle: {
    fontSize: 30,
    margin: 10
  },
  infoBoxContent: {
    marginLeft: 10,
    marginRight: 20,
    textAlign: 'justify'

  }
})

export default Distance