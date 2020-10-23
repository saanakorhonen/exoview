import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import PlanetComparison from '../components/PlanetComparison';
import PlanetNameComp from '../components/PlanetNameComp';

const Visualisation = ({ route }) => {

  return (
    <View style={styles.background}>
      <PlanetComparison planet={route.params.planet} />
      <PlanetNameComp name={route.params.planet.pname}/>
    </View>
  )

}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'rgb(25, 25, 25)'
  }
})

export default Visualisation;