import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import Planet from '../components/Planet';

const Visualisation = ({ route }) => {

  console.log(route.params.planet)

  const params = ( param ) => param  === undefined ? 'an unknown amount' : param
  
  const name = route.params.planet.pname;
  const radius = params(route.params.planet.pradius)
  const mass = params(route.params.planet.pmasse)
  const massJ = params(route.params.planet.pl_bmassj)
  const radiusJ = params(route.params.planet.pl_radj)

  return (
    <View style={styles.container} >
      <View style={styles.planetBox} >
        <Planet planet={route.params.planet } />
      </View>
      {/** Teksti selitystä */}
      <View style={styles.textBox}>
        <Text style={{color: 'black'}}>
          Planet {name}'s radius is {radius} of Earth's and it's mass {mass} as much.
          Planet {name}'s radius is {radiusJ} of Jupiter's and it's mass {massJ} as much.
        </Text>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent:'center',
    backgroundColor: 'rgb(25, 25, 25)'
  },
  planetBox :{
    flex:4
  },
  textBox: {
    flex:1,
    backgroundColor: 'white',
  }

})

export default Visualisation;