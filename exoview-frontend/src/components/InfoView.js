import React, { useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';

const InfoView = ( { data }) => {
  //renderoidään näkymiin planeetan tiedot
  return (
    <View style={styles.container}>
      <View style={styles.element}>
        <Text>Host star</Text>
        <Text style={styles.text}>{data.hostname !== '' ? data.hostname : '-'}</Text>
      </View>
      <View style={styles.element}>
        <Text>Planet mass</Text>
        <Text style={styles.text}>{data.pl_masse!== '' ? data.pl_masse: '-'}</Text>
      </View>
      <View style={styles.element}>
        <Text>Planet radius</Text>
        <Text style={styles.text}>{data.pl_rade !== '' ? data.pl_rade: '-'}</Text>
      </View>
      <View style={styles.element}>
        <Text>Discovery year</Text>
        <Text style={styles.text}>{data.disc_year !== '' ? data.disc_year : '-'}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10,
    flex: 1,
    justifyContent:'space-evenly',
    backgroundColor: '#fff',
  },
  element: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.84,
    elevation: 5,
  },
  text : {
    fontSize: 18,
    fontWeight: 'bold',
  }

})
export default InfoView