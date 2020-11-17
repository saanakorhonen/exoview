import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  FlatList, Keyboard, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import DistanceOrbit from './DistanceOrbit'
//import PlanetSizeComparison from './p'

/*
merkurius 0,4667
venus 0.728213
maa 1
mars 1.666
jupiter 5.4588 
saturnus 10.1238
uranus 20.11
neptunus 30.33
*/
const OurSolarSystem= ({ planet }) => {

    return (
        <View >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 16, backgroundColor: 'black'}}>{planet.au} {planet.name}</Text>
            </View>
        </View>

    )
};


export default OurSolarSystem;