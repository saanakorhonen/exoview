"use strict";
import React from "react";
import { TouchableOpacity, View, Dimensions, Text, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';


/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function Stars({ planet, system,  navigation }) {
    console.log(planet.pl_rade)

  const pEarthRel = planet.pl_rade / 1.0;

  const bPlanet = {
    color:"",
    relativeSize: -1,
  };

  const fPlanet = {
    color: "",
    relativeSize: -1,
  }

  if(pEarthRel > 1){
    bPlanet.color = 'grey';
    bPlanet.relativeSize = 1.0
    fPlanet.relativeSize = 1 / pEarthRel 
    fPlanet.color = "darkblue";
    //padding = (WW() - (WW() * relativeSize)) / 2;
  }
  else {
      bPlanet.color = "darkblue";
      bPlanet.relativeSize = 1.0
      fPlanet.color = 'grey';
      fPlanet.relativeSize = planet.pl_rad;

     // padding = (WW() - (WW() * relativeSize)) / 2;
  } 
  
  return (
    <View>
      <View  style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
      <TouchableOpacity  onPress = { () => navigation.navigate('Information', {planet: planet,system: system})}>
      <View style={{  alignItems: 'center', justifyContent: 'center', width:Dimensions.get('window').width / 2 }}  >
      {/** background star */}
        <View style={{ position: 'relative', backgroundColor: bPlanet.color, height: WW()* bPlanet.relativeSize, width: WW()*bPlanet.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}> 
        </View>
        {/** front star */}
        <View style={{ position: 'absolute',backgroundColor: fPlanet.color,  height: WW()* fPlanet.relativeSize, width: WW()*fPlanet.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}>
        </View>
      </View>
    </TouchableOpacity> 
      <View >
        <Text style={{color:'white'}}>{planet.pl_orbsmax} AU</Text>
        <Text style={{color:'lightblue', marginRight: 10, textDecorationLine: 'underline'}} onPress={() => {
							Alert.alert(`Info about ${planet.pl_name}`,
                  `${planet.pl_name} has ${planet.pl_rade} radius of earth and ${planet.pl_masse} mass of Earth. 
                  Its orbit is ${planet.pl_orbsmax} of Earths and revolves arounds its star every days.`
								);
							}}>{planet.pl_name} </Text>
 
        {/*
               <AntDesign name="infocirlce" size={24} color="white"  />
        <Text style={{color:'white'}}>{planet.pl_name} has {planet.plrade} radius of earth and {planet.pl_masse}
          mass of Earth. Its orbit is {planet.orbsmax} of Earths and revolves arounds its star every {planet.orbper}
        days.</Text> */}
      </View>
      </View>
      </View>)
}

/**
 * Ottaa ikkunan leveydestä jonkun murto-osan
 */
function WW() {
  let ww = Dimensions.get('window').width / 8;
  return ww;
}

