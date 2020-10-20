"use strict";
import React from "react";
import { Text, View, Dimensions } from "react-native";

const color = "lightblue";


/**
 * Piirtää vierekkäin kokovertauksen eksoplaneetan ja maan välillä.
 * TODO: Vertaa Jupiteriin jos koko on sitä lähempänä
 * @param {*} props
 *  name = "Planeetan nimi" (string)
 *  size = planeetan koko numerona (pl_rade)
 */
export default function PlanetComparison(props) {

  const earth = 1.0;
  var exoSize = 1.0;
  
  let relativeSize = 1.0;
  exoSize = props.planet.prade;

  if (isNaN(props.planet.prade)) {
    exoSize = 1.0;
  }

  relativeSize = exoSize / earth;

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <Planet name={props.planet.pname} relative={relativeSize}></Planet>
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

  let name = props.name;
  if (props.isEarth) name = "Earth";

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
    <View style={{flex: 0.5, alignItems: "center", height: WW(), paddingTop: padding}}>
        <Text style={
          {
            fontSize: (30  * relativeSize), 
            borderRadius: 1000, // random ylisuuri numero
            backgroundColor: color, 
            width: WW() * relativeSize, 
            height: WW() * relativeSize, 
            paddingTop: 55 * relativeSize, 
            textAlign: 'center'}
          } >
          {name}
        </Text>
      </View>
  );
}