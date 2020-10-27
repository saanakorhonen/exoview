"use strict";
import React from "react";
import { Text, View, Dimensions } from "react-native";

const color = "lightblue";
const exocolor = "lightblue";


/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function PlanetComparison(props) {

  const earth = props.comparison;
  const jupiter = 11.209;
  var exoSize = 1.3;
  
  let relativeSize = 1.0;
  exoSize = props.planet.pradius;

  if (isNaN(props.planet.pradius)) {
    exoSize = 1.0;
  }

  relativeSize = exoSize / earth;

  return (
    <View style={{flex: 0.4, flexDirection: 'row', marginTop: (WW() / 4)}}>
      <Planet relative={relativeSize}></Planet>
      <Planet isEarth={true} relative={relativeSize}></Planet>
    </View>
  );
}

/**
 * Ottaa ikkunan leveydestä jonkun murto-osan
 */
function WW() {
  let ww = Dimensions.get('window').width / 2.5;
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
            backgroundColor: color, 
            width: WW() * relativeSize, 
            height: WW() * relativeSize, 
            paddingTop: 55 * relativeSize, 
            textAlign: 'center'}
          } >
        </View>
      </View>
  );
}
