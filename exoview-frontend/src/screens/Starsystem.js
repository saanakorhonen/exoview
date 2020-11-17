import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  FlatList, Keyboard, View, Text, TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';
import DistanceOrbit from '../components/DistanceOrbit'
import Stars from '../components/Stars'
import OurSolarSystem from '../components/OurSolarSystem';
import Planets from '../components/Planets'

/*
merkurius 0,4667
venus 0.728213
maa 1
mars 1.666
jupiter 5.4588 
saturnus 10.1238
uranus 20.11
neptunus 30.33

TODO: sklaaukset fiksusti
TODO: tekstit
*/
const Starsystem = ({ route }) => {
    const hPhone = Dimensions.get('screen').height
    console.log('hphone', hPhone)
    //console.log()
    let  auEarth =Dimensions.get('window').width / 2 +Dimensions.get('window').height/6
    var etaisyydet = [ {name: 'Earth', au:1},{name:"Mars",au:1.666},{name:"Jupiter",au:5.4588},{name:"Saturn",au:10.1238},{name:"Uranus",au:20.11},{name:"Neptune",au:30.33}];
    let  pituus = kaukaisin(route.params.planets) ;
    let kaukaisinPlaneetta = solarSystem(pituus,etaisyydet)
        
    console.log('kaukaisinp', kaukaisinPlaneetta)
    if (pituus < 1.0) {
        console.log('pituus pienempi kuin auearth', pituus)
        auEarth = auEarth *20
        pituus = auEarth
        etaisyydet = [...etaisyydet, {name: 'Mercury', au: 0.4667}, {name:'Venus', au: 0.72813}]
    } else {
        pituus = kaukaisinPlaneetta * auEarth
    }
    console.log('pituus', pituus)
    console.log('star sytemissa ollaan', route.params.planets)

    return (
        <View style={styles.container}>
            <ScrollView>
                <View key = {2} style={styles.system}>
                    <Stars key={route.params.star.hostname} star={route.params.star}></Stars>
                {/*jokaista planeettaa kohten palautetaan*/}
                    <View style={{position: 'relative'}}>
                        <DistanceOrbit height ={pituus}/>
                    </View>
                    {etaisyydet.map((planet) => 
                         <View key={planet.pl_name} style={{position: 'absolute', marginTop: auEarth*planet.au}}>
                         <OurSolarSystem planet={planet}/>
                         </View>
                     )}
                    {route.params.planets.map((planet) =>
                    <View key={planet.pl_name} style={{position: 'absolute', marginTop: Dimensions.get('window').width / 2 +auEarth*planet.pl_orbsmax}}>
                        <Planets planet={planet} />
                    </View>
                )}
                </View>

            </ScrollView>
            <View style={styles.infotext}><Text>kissa</Text></View>
            
        </View>

    )
};

function solarSystem(pituus, etaisyydet) {
for (const p in etaisyydet) {
        if (pituus <etaisyydet[p].au) {console.log('returnissa'); return etaisyydet[p].au}

}
    return pituus
}

function kaukaisin(planets){
var kaukaisin = planets[0];
for (const p in planets) {
    if(planets[p].pl_orbsmax > kaukaisin.pl_orbsmax){
        kaukaisin = planets[p];
    }
}
return kaukaisin.pl_orbsmax;

    
}





const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent:'flex-start',
      //justifyContent: 'center',
      backgroundColor: 'white',
      paddingTop: 10,
    },
    system: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor:'black',
    },
    infotext: {
        flex: 10,
        backgroundColor: 'red',
    }
})

export default Starsystem;