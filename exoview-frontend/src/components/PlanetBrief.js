import React from 'react'
import exoService from '../services/exoplanets'
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native'

const PlanetBrief = ({ data, allPlanets, navigation } ) => {

    var isVisible = false;

    const toggleVisibility = () => {
        isVisible = !isVisible;
    }

    const renderView = () => {
        if (isVisible) {
            return view;
        }

        return null;
    }

    var view =  <View style={{flexDirection:'row'}}>    
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoText}>
                            Host star: {data.hostname}
                        </Text>
                        <Text style={styles.infoText}>
                            Masse: {data.pl_masse}
                        </Text>
                        <Text style={styles.infoText}>
                            Radius: {data.pl_rade}
                        </Text>
                        {/*
                        <Text>
                            Discovery year: { props.data.disc_year}
                        </Text>
                        */}
                    </View>
                    <View style = {styles.buttonWrapper}>
                        <TouchableOpacity style={styles.button} onPress={() => handleViewPlanet({data: data,allPlanets: allPlanets,navigation: navigation})}><Text style={styles.buttonText}>View planet</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleStarsystem({data: data,allPlanets: allPlanets,navigation: navigation})}><Text style={styles.buttonText}>Stellar System</Text></TouchableOpacity>
                    </View>
                </View>

    return (
        <View style={styles.container}>
            <View style = {styles.headerWrapper} onPress = {toggleVisibility()}>
                <Text style = {styles.header}>
                    {data.pl_name }
                </Text>
            </View>
            {renderView()}
        </View>
    )
}

//painettaessa Stellas System
const handleStarsystem = (props) => {
    var nimi = props.data.hostname;
    exoService.getStellarSystem(nimi)
    .then((star) => {

        if (star.hostname.indexOf('+') > -1) {
            var index = star.hostname.indexOf('+');

            var regex = star.hostname.substring(0, index) + '\\' + star.hostname.substring(index, star.hostname.length);
        }

        else regex = star.hostname;

        var tahdenplaneetat = props.allPlanets.filter(planet => planet['hostname'].match(regex));
        const system = {star: star, planets: tahdenplaneetat}
        props.navigation.navigate('Stellar System', system)})
}

//painettaessa viewplanet
const handleViewPlanet= (props) => {
    var nimi = props.data.hostname;
    exoService.getStellarSystem(nimi)
    .then((star) => {

        if (star.hostname.indexOf('+') > -1) {
            var index = nimi.indexOf('+');

            var regex = nimi.substring(0, index) + '\\' + nimi.substring(index, nimi.length);
        }

        else regex = nimi;

        
        var tahdenplaneetat = props.allPlanets.filter(planet => planet['hostname'].match(regex))
        const system = {star: star, planets: tahdenplaneetat}
        props.navigation.navigate('Information',{ planet:props.data, system: system}) })
    
}

const styles = StyleSheet.create({
    button: {
        alignItems:'center',
        backgroundColor:'rgba(82, 113, 255, 0.7)',
        color: "white",
        padding: 10,
        margin: 2,
        borderRadius: 10
    },
    buttonText: {
        color: "white"
    },
    buttonWrapper: {
        //flexDirection: "row",
        alignItems: "stretch",    
    },
    container: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding:10,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10, 

    },
    header: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#ffff"
    },
    headerWrapper: {
        flexDirection:'row',
        justifyContent:'flex-start',
        //backgroundColor: '#134261',
       // borderWidth:1,
        //borderColor: '#134261',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius:40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40, 
        
    },
    infoText: {
        color: 'white'
    },
    infoWrapper: {
        justifyContent: "center",
        alignContent: "center",
        flex: 2
    },
})

export default PlanetBrief;