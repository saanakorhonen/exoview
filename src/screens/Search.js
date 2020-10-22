import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { parse } from 'fast-xml-parser';
import { TouchableOpacity } from 'react-native-gesture-handler';


//Planeettojen etsimisikkuna
const Search = ( {navigation} ) => {

    //Aloitusmaksimi queryssa
    var start = 10

    //Base url
    var url =  'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+10+hostname,pl_name,pl_rade,pl_masse+from+ps+where+disc_year+=+2020'

    //Löydetyt planeetat
    const [foundPlanets, setFoundPlanets] = useState([]) 

    //Aloittaa hakemalla datan
    useEffect(() => {
        fetchData();
    }, []);



    //Hakee default-datan tässä vaiheessa
    const fetchData = async () => {
        const response = await fetch(url);
        const teksti = await response.text();
        const objects = await parse(teksti);
        const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
        
        setFoundPlanets(planetArray);
    }


    //Tekee löydetyistä planeetoista katseltavia komponentteja
    const renderFoundPlanets = () => {
        return foundPlanets.map((obj) => {
            let planet = obj.TD;
            planetProps = {
                hname: planet[0],
                pname: planet[1],
                pradius: planet[2],
                pmasse: planet[3]
            }
            
            return <PlanetBrief data={planetProps}/>
        });
    }

    //TODO: key prop
    return (
        <ScrollView>
            <View>
                {renderFoundPlanets()}
            </View>
        </ScrollView>

    )
}

//Planeetan kevyet tiedot search-näkymään
//TODO komponentin voinee eriyttää
//TODO infon collapse
//TODO n/a jos tietoa ei ole saatavilla
const PlanetBrief = ( props ) => {

    return (
        <View style={styles.container}>
            <View style = {styles.headerWrapper}>
                <Text style = {styles.header}>
                    { props.data.pname }
                </Text>
            </View>
            <View style={styles.infoWrapper}>
                <Text>
                    Host star: { props.data.hname}
                </Text>
                <Text>
                    Masse: { props.data.pmasse}
                </Text>
                <Text>
                    Radius: { props.data.pradius}
                </Text>
            </View>
            <View style = {styles.buttonWrapper}>
                <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View planet</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View host star</Text></TouchableOpacity>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        padding: 20
    },

    infoWrapper: {
        justifyContent: "center",
        alignContent: "center"
    },

    headerWrapper: {
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor: '#134261',
        borderWidth:1,
        borderColor: '#134261',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius:40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },

    header: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#ffff"
    },

    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "center"
    },

    button:{
        backgroundColor:'#134261',
        color: "white",
        padding: 10
    },

    buttonText: {
        color: "white"
    }
});


export default Search;