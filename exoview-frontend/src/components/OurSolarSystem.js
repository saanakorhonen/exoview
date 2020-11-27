import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  Dimensions,View, Text } from 'react-native';
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
        <View  >
            <View style={{flex: 1,flexDirection: 'row', alignItems: 'center', justifyContent:'center', marginLeft:Dimensions.get('window').width / 8}}>
                <Text style={{color: 'white', fontSize: 16, backgroundColor: 'black'}}>{planet.au.toFixed(2)} AU {planet.name}</Text>
            </View>
        </View>

    )
};


export default OurSolarSystem;