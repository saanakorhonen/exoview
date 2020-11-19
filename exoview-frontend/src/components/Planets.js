"use strict";
import React from "react";
import { TouchableOpacity, View, Dimensions, Text } from "react-native";


/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function Stars({ planet, navigation }) {
    console.log(planet.pl_rade)
  /*
  let relativeSize = 1.0;
  exoSize = props.planet.pl_rade;

  if (isNaN(props.planet.pl_rade)) {
    exoSize = 1.0;
  }
*/

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
    <TouchableOpacity onPress = { () => navigation.navigate('Information', {planet: planet,system: []})}>
    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }  }  >
      {/** background star */}
        <View style={{ position: 'relative', backgroundColor: bPlanet.color, height: WW()* bPlanet.relativeSize, width: WW()*bPlanet.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}> 
        </View>
        {/** front star */}
        <View style={{ position: 'absolute',backgroundColor: fPlanet.color,  height: WW()* fPlanet.relativeSize, width: WW()*fPlanet.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}>
        </View> 
    </View>

    </TouchableOpacity>  )
}


/**
 * Ottaa ikkunan leveydestä jonkun murto-osan
 */
function WW() {
  let ww = Dimensions.get('window').width / 8;
  return ww;
}

