import React, { useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import PlanetComparison from '../components/PlanetComparison'

const Visualisation = ({ route }) => {

  return (
    <View>
      <PlanetComparison planet={route.params.planet} />
    </View>
  )

}

const styles = StyleSheet.create({
})

export default Visualisation;