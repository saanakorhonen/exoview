import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  TouchableOpacity, FlatList, Keyboard, View, Text, TextInput, StyleSheet, ScrollView, Dimensions, ImageBackground } from 'react-native';
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
const Starsystem = ({ route, navigation }) => {
    //console.log('satrsyst', route.params)

    const hPhone = Dimensions.get('window').height
    const hStar = Dimensions.get('window').width / 2
    const star = route.params.star != undefined ? route.params.star : route.params
    const system = {star: star, planets: route.params.planets}
    let  auEarth =hPhone/5// 1 AU

    //meidän aurinkokunnan planettoojen etäisyydet
    var etaisyydet = [ {name: 'Mercury', au: 0.4667}, {name:'Venus', au: 0.72813}, {name: 'Earth', au:1},{name:"Mars",au:1.666},{name:"Jupiter",au:5.4588},{name:"Saturn",au:10.1238},{name:"Uranus",au:20.11},{name:"Neptune",au:30.33}];
    let  pituus = kaukaisin(route.params.planets) ; // kaukaisin tähtijärjestelmän eksoplaneetta (AU)
    let kaukaisinPlaneetta = solarSystem(pituus,etaisyydet) // meidän aurinkokunnan planeettta, jota lähempänä kaukaisin eksoplaneetta on (AU)
    let lahinAU = lahin(route.params.planets)


    // etäisyyksien uudelleen suhteuttaminen: 1. lähempänä kuin maa, maa ja neptunus välillä, kauempana kuin neptunus
    if (lahinAU < 1.0) {
        auEarth = auEarth/ lahinAU // aseteteaan uuteen suhteeseen lähin eksoplaneetta nyt 1AU
        pituus =  auEarth *kaukaisinPlaneetta +30
        if (lahinAU > 0.48 )  {etaisyydet.shift(); etaisyydet.shift()}
    } else  if (lahinAU < 31 ){
        pituus = kaukaisinPlaneetta * auEarth
        etaisyydet.shift();etaisyydet.shift() //poistetaan näkymästä merkurius ja venus
    } else {
        etaisyydet =[{name:"Neptune",au:30.44}]
        auEarth = auEarth/30.244 /// aseteteaan uuteen suhteeseen lähin eksoplaneetta nyt 1AU
        pituus =  auEarth *kaukaisinPlaneetta + 100
        
        
    }
    if (pituus < hPhone) pituus=hPhone  // pidetään huoli, että viiva jatkuu vähintään puhelimen näytön pituuden verran


    //console.log('auearth', auEarth)
    return ( 
        <ImageBackground style={styles.container} source={require('../../assets/background.png')} >
            
            <ScrollView > 
                {/*
            <View style={{height: 200}}>
                <Text style={{color:'white'}}>Kissa</Text>
                <Text style={{color:'white'}}>Kissa</Text>
                <Text style={{color:'white'}}>Kissa</Text>
                <Text style={{color:'white'}}>Kissa</Text>
                <Text style={{color:'white'}}>Kissa</Text>
                </View> */}
                <View key = {2} style={styles.system}>
                    <Stars key={route.params.star.hostname} star={route.params.star}></Stars>
                {/*jokaista planeettaa kohten palautetaan*/}
                    <View style={{position: 'relative'}} >
                        <DistanceOrbit height ={pituus}/>
                    </View>
                   {etaisyydet.map((planet) => 
                         <View key={generateKey()} style={{ position: 'absolute', marginTop: auEarth*planet.au + hStar}}>
                         <OurSolarSystem planet={planet}/>
                         </View>
                     )}
                    {route.params.planets.map((planet) =>
                    <View key={generateKey()} style={{position: 'absolute', marginTop:  auEarth*planet.pl_orbsmax + hStar -(Dimensions.get('window').width / 16), marginBottom:(Dimensions.get('window').width / 16) }} >
                        <Planets planet={planet} navigation={navigation} system={system} />
                    </View>
                    )}
                </View>
            </ScrollView>
        </ImageBackground>
    )
};

function solarSystem(pituus, etaisyydet) {
for (const p in etaisyydet) {
        if (pituus <etaisyydet[p].au) {console.log('Starsystem.js:92 returnissa'); return etaisyydet[p].au}

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
function lahin(planets){
    var lahin = planets[0];
    for (const p in planets) {
        if(planets[p].pl_orbsmax < lahin.pl_orbsmax){
            lahin = planets[p];
        }
    }
    return lahin.pl_orbsmax; 
}

//Luo id:n planeettakomponenteille
const generateKey = () => {
    const keys = '1234567890abcdefghijklmnopqrstuvwxyz'

    const idLength = 10

    let i = 0;

    let id = '';

    while (i < idLength) {
        id = id + keys.charAt(Math.floor(Math.random() * Math.floor(keys.length)))
        i++;
    }

    return id;
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent:'flex-start',
      //justifyContent: 'center',
     // alignItems: 'center',
      //backgroundColor: 'black',
      paddingTop: 10,
      paddingLeft: 10
    },
    system: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative'
       // backgroundColor:'black',
    },
    infotext: {
        flex: 10,
       // backgroundColor: 'black',
    },
    textTitle: {
        fontSize: 20,
        margin: 10,
        color: "white",
        fontWeight: 'bold'
    },
    textParagraph: {
        color: 'white',
        margin: 10
    }
})
/**         <View style={styles.infotext}>
                <Text style={styles.textTitle}>{star.hostname}</Text>
                <Text style={{color:'white'}}>- star system</Text>
                <Text style={styles.textParagraph}>{star.hostname}</Text>
            </View> */
export default Starsystem;


