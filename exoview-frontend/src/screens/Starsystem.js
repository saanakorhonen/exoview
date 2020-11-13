import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  FlatList, Keyboard, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import PlanetAndDistance from '../components/PlanetAndDistance'
import Stars from '../components/Stars'


const Starsystem = ({ route }) => {

    console.log('star sytemissa ollaan', route.params.star)
    return (
        <View style={styles.container}>
            <View style={styles.systen}>
                <Stars star={route.params.star}></Stars>
            {/*jokaista planeettaa kohten palautetaan*/}
            <PlanetAndDistance style={{flex: 1}}></PlanetAndDistance>
            </View>
            <View style={styles.infotext}><Text>kissa</Text></View>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'flex-start',
      backgroundColor: 'rgba(82, 113, 255, 1.0)',
    },
    system: {
        flex: 2

    },
    infotext: {
        flex: 3,
        backgroundColor: 'red',
    }
})

export default Starsystem;