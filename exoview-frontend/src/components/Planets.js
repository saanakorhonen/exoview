"use strict";
import React from "react";
import { TouchableOpacity, View, Dimensions, Text, Alert } from "react-native";
//import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function Planets({ planet, system,  navigation }) {

  const pEarthRel = (planet.pl_rade !== "" ? planet.pl_rade : 1.0) / 1.0;

  const bPlanet = {
    color:"",
    relativeSize: -1,
    isEarth:''
  };

  const fPlanet = {
    color: "",
    relativeSize: -1,
    isEarth:''
  }

  if(pEarthRel > 1){
    bPlanet.color = 'rgba(82, 113, 255, 0.7)';
    bPlanet.relativeSize = 1.0
    bPlanet.isEarth = false
    fPlanet.relativeSize = 1 / pEarthRel 
    fPlanet.color = "white";
    fPlanet.isEarth = true
    //padding = (WW() - (WW() * relativeSize)) / 2;
  }
  else {
      bPlanet.color = "white";
      bPlanet.relativeSize = 1.0
      bPlanet.isEarth = true
      fPlanet.color = 'rgba(82, 113, 255, 0.7)';
      fPlanet.relativeSize = planet.pl_rade !== "" ? planet.pl_rade : 1.0;
      fPlanet.isEarth = false

     // padding = (WW() - (WW() * relativeSize)) / 2;
  } 
  
  return (
    <View>
      <View  style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
        <TouchableOpacity  onPress = { () => navigation.navigate('Information', {planet: planet,system: system})}>
          <View style={{  alignItems: 'center', justifyContent: 'center', width:Dimensions.get('window').width / 2 }}  >
          {/** background planet */}
          {bPlanet.isEarth
            ? <MaterialCommunityIcons  style={{position:'absolute'}} name="earth" size={WW()* bPlanet.relativeSize} color={bPlanet.color} />
            : <View style={{ position: 'relative', backgroundColor: bPlanet.color, height: WW()* bPlanet.relativeSize, width: WW()*bPlanet.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}></View>
          }
          {/** front planet */}
          {fPlanet.isEarth
            ? <MaterialCommunityIcons  style={{position:'absolute'}} name="earth" size={WW()* fPlanet.relativeSize} color={fPlanet.color} />
            : <View style={{ position: 'absolute',backgroundColor: fPlanet.color,  height: WW()* fPlanet.relativeSize, width: WW()*fPlanet.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}></View>
         }
          </View>
        </TouchableOpacity> 
        <View >
          <Text style={{color:'white'}}>{planet.pl_orbsmax} AU</Text>
          <Text style={{color: 'rgba(82, 113, 255, 1.0)', marginRight: 10, textDecorationLine: 'underline'}} onPress={() => {
							Alert.alert(`Info about ${planet.pl_name}`,
                  `${planet.pl_name} has ${planet.pl_rade !== "" ? planet.pl_rade : 'unknown'} radius of earth and ${planet.pl_masse !== "" ? planet.pl_masse :'unknown'} mass of Earth. \n\nIts orbit is ${planet.pl_orbsmax !== "" ? planet.pl_orbsmax :'unknown'} of Earths and revolves arounds its star every ${planet.pl_orbper !== "" ? planet.pl_orbper.toFixed(0) : 'unknown'} days.`,
                  [
                    {
                      text: 'View exoplanet',
                      onPress: () => navigation.navigate('Information', {planet: planet,system: system}),
                    },
                    {
                      text: 'Close',
                    }
                  ],
                  {cancelable: true}
								);
							}}>{planet.pl_name} </Text>
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

