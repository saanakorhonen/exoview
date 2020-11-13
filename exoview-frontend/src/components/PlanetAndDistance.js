import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  FlatList, Keyboard, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import DistanceOrbit from './DistanceOrbit'
//import PlanetSizeComparison from './p'


const PlanetAndDistance = () => {
    return (
        <View style={styles.container}>
            <DistanceOrbit style={{flex:1, margin: 40}}>

            </DistanceOrbit>
            {/*
            <PlanetSizeComparison>

            </PlanetSizeComparison>*/}

        </View>

    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignContent:'center',

    }
})

export default PlanetAndDistance;