import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import PlanetComparison from '../components/PlanetComparison';
import PlanetNameComp from '../components/PlanetNameComp';

const Planet = ({ planet }) => {

  return (
    <View style={styles.background}>
      <PlanetComparison planet={planet} comparison={1.0} style={styles.Planets} />
      <PlanetNameComp name={planet.pname} comparison={'Earth'}  style={styles.Names}/>
      <PlanetComparison planet={planet} comparison={11.209} style={styles.Planets} />
      <PlanetNameComp name={planet.pname} comparison={'Jupiter'} style={styles.Names} color="yellow"/>
    </View>
  )

}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'rgba(252, 125, 25, 0.0)'
  },
})

export default Planet;