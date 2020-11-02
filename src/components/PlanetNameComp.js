"use strict";
import React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";

/**
 * Laittaa planeetan nimen vierekkäin Earthin kanssa.
 * Käyttötarkoitus laittaa PlanetComparisonin alle.
 * Pitää jossain vaiheessa laittaa saman komponentin alle.
 * @param {*} props name = planeetan nimi
 */
export default function PlanetNameComp(props) {
  

  return (
    <View style={{flex: 1, marginTop:Dimensions.get('window').height / 5}}>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.text}>{props.name}</Text>
        <Text style={styles.text}>{props.comparison}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
    color: 'rgb(255, 255, 255)',
    textAlign: "center",
    fontSize: 25
  }
})

/**
 * Ottaa ikkunan leveydestä jonkun murto-osan
 */
function WW() {
  let ww = Dimensions.get('window').width / 2.5;
  return ww;
}
