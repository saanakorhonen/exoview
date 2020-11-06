import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import Planet from '../components/Planet';

const Visualisation = ({ planet }) => {
  console.log(planet)

  const params = ( param ) => param  === undefined ? 'an unknown amount' : param
  
  const name = planet.pl_name;
  const radius = params(planet.pl_rade)
  const mass = params(planet.pl_masse)
  const massJ = params(planet.pl_massj)
  const radiusJ = params(planet.pl_radj)

  return (
    <View style={styles.container} >
      <View style={styles.planetBox} >
        <Planet planet={planet } />
      </View>
      {/** Teksti selitystä */}
      <View style={styles.textBox}>
        <Text style={{color: 'white', fontSize: 16 ,marginHorizontal: 10, marginBottom:5}}>
          Planet {name}'s radius is {radius} of Earth's and it's mass {mass} as much.
        </Text>
        <Text style={{color: 'white', fontSize: 16 ,marginHorizontal: 10, marginTop: 5}}>
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
    flex:4,
  },
  textBox: {
    flex:1,
    justifyContent:'center',
    backgroundColor: 'rgba(82, 113, 255, 0.7)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }

})

export default Visualisation;