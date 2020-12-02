import React from 'react'
import {  View, Text, } from 'react-native'

const BallAndName = ({ pName, pSize, flex, top }) => {
  return (
    <View style={{
      flex: flex,
      flexDirection: 'row',
      width: 200,
      top: -pSize / 2,
      left: -pSize / 2
    }}>
      <View style={{
        width: pSize,
        height: pSize,
        borderRadius: 50,
        marginRight: 10,
        backgroundColor: 'white',

      }}></View>
      <Text style={{ color: 'white', top: top, width: 100 }}>{pName}</Text>
    </View>
  )
}

export default BallAndName;