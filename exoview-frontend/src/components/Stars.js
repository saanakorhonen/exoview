"use strict";
import React from "react";
import { Text, View, Dimensions } from "react-native";

let fColor = "lightblue";
let bColor = "lightblue";


/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function Stars({ star }) {
    console.log(star.st_rad)
  /*
  let relativeSize = 1.0;
  exoSize = props.planet.pl_rade;

  if (isNaN(props.planet.pl_rade)) {
    exoSize = 1.0;
  }
*/

  const starSunRel = star.st_rad / 1.0;

  const bStar = {
    color:"",
    relativeSize: -1,
  };

  const fStar = {
    color: "",
    relativeSize: -1,
  }

  if(starSunRel > 1){
    bStar.color = starColor(star.st_teff);
    bStar.relativeSize = 1.0
    fStar.relativeSize = 1 / starSunRel 
    fStar.color = starColor(5772);
    //padding = (WW() - (WW() * relativeSize)) / 2;
  }
  else {
      bStar.color = starColor(5772);
      bStar.relativeSize = 1.0

      fStar.color = starColor(star.st_teff);
      fStar.relativeSize = star.st_rad;

     // padding = (WW() - (WW() * relativeSize)) / 2;
  }
  
  console.log(bStar.color)
  return (
    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
      {/** background star */}
        <View style={{ position: 'relative', backgroundColor: bStar.color, height: WW()* bStar.relativeSize, width: WW()*bStar.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}> 
        </View>
        {/** front star */}
        <View style={{ position: 'absolute',backgroundColor: fStar.color,  height: WW()* fStar.relativeSize, width: WW()*fStar.relativeSize, borderRadius: 1000, borderColor: 'grey', borderWidth:1}}>
        </View> 
    </View>
  );
}

/**
 * 
 * @param { <Planet relative={relativeSize}></Planet>
      <Planet isEarth={true} relative={relativeSize}></Planet>} temp 
 */

function starColor(temp){
    if(temp < 3500) return "red";
    else if(temp < 5000) return "orange";
    else if(temp < 8000) return "yellow";
    else if(temp < 20000) return "white";
    return "blue";

}


/**
 * Ottaa ikkunan leveydestä jonkun murto-osan
 */
function WW() {
  let ww = Dimensions.get('window').width / 2;
  return ww;
}

/**
 * Tekee sen planeetan
 * @param {*} props
 *  name = planeetan nimi, ei tarvi antaa jos maa
 *  isEarth = boolean true jos maa
 *  relative = relativeSize tuolta ylempää ^
 */
const Planet = (props) => {

  let relativeSize = 1.0;
  let padding = 0;

  // Jos ei ole maa mutta on sitä pienempi, pienennetään suhteessa vakiokokoon
  if (props.relative < 1.0 && !props.isEarth) {
    relativeSize = props.relative;
    padding = (WW() - (WW() * relativeSize)) / 2;
  }

  // Jos on maa ja eksoplaneetta on suurempi, otetaan kokosuhteen käänteisluku
  if (props.relative > 1.0 && props.isEarth) {
    relativeSize = 1 / props.relative;
    padding = (WW() - (WW() * relativeSize)) / 2;
  }

  return (
    <View style={{flex: 1, alignItems: "center", height: WW(), paddingTop: padding, backgroundColor: 'rgba(52, 52, 52, 0.0)'}}>
        <View style={
          {
            fontSize: (30  * relativeSize), 
            borderRadius: 1000, // random ylisuuri numero
            backgroundColor: props.color, 
            width: WW() * relativeSize, 
            height: WW() * relativeSize, 
            paddingTop: 55 * relativeSize, 
            textAlign: 'center'}
          } >
        </View>
      </View>
  );
}
