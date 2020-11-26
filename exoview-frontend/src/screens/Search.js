import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  FlatList, Keyboard, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { parse } from 'fast-xml-parser';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import { MaterialIcons } from '@expo/vector-icons';
import { set } from 'react-native-reanimated';

//Planeettojen etsimisikkuna
const Search = ({ navigation, route } ) => {

    /*Aloitusmaksimi queryssa
    var start = 0;
    var alku = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj+from+pscomppars+where+";
	var loppu = "+default_flag+=+1";//format=csv;
	*/

    //Löydetyt planeetat
    const [foundPlanets, setFoundPlanets] = useState([]) 

    const [allPlanets, setAllPlanets] = useState([])

    //Hakufiltteri
    const [searchFilter, setFilter] = useState('')

    //Hakutermi
    const [searchTerm, changeSearchTerm] = useState('')

    //laitettava tänne, jotta päivittyy aina
    const [juoksevaluku, setJuoksevaluku] = useState(0)

    //Menutriggerin tekstin vaihto
    const [menuTriggerText, setMenuTriggerText] = useState('Search options')


    //Aloittaa hakemalla datan
    useEffect(() => {
        setAllPlanets(route.params)
    }, []);

    //asetetaan alussa kaikki planeetat löytyneiksi
    useEffect(() => {
        setFoundPlanets(allPlanets)
    }, [allPlanets])


    //Tekee löydetyistä planeetoista katseltavia komponentteja
    const renderFoundPlanets = () => {
        return foundPlanets.map(planet => <PlanetBrief navigation={navigation} data={planet} key={generateKey()}/>)
    }


    //Käsittelee hakutermin ja -filtterin
    const parseSearchTerms = () => {
        
        if(searchTerm === "" || searchFilter === ""){ 
            Keyboard.dismiss(); 
            setFilter(""); 
            setMenuTriggerText('Search Options'); 
            return setFoundPlanets(allPlanets);
        }
        const searchedWord = '^' + searchTerm
        const filteredPlanetsAr = (searchFilter !== 'pl_rade' && searchFilter !== 'pl_masse' 

        ? (allPlanets.filter(planet => planet[searchFilter].toLowerCase().match(searchTerm.toLowerCase())))
        : (allPlanets.filter(planet => planet[searchFilter].toString().match(searchedWord))))

        setFoundPlanets(filteredPlanetsAr)
        Keyboard.dismiss()

    }

    const handleTextChange = (term) => {
        if (term === '') {
            setFilter(""); 
            //setMenuTriggerText('Search Options'); 
            return setFoundPlanets(allPlanets);
        }

        changeSearchTerm(term)
    }

    //Luo uuden api queryn
    const createQuery = () => {
        var hakuehto = searchFilter;

        //var rajat = '+rownum+>=' + juoksevaluku + '+and+rownum+<+' + (juoksevaluku+9) +'+and'
        
        if (hakuehto === '' || hakuehto === undefined) {
            console.log(alku+/*rajat+*/loppu);
            return alku + /*rajat+*/ loppu;
        } 
        //+and'    + /*rajat+*/ loppu
        var hakutermi = '+like+\'' + searchTerm + '%\''
        console.log(alku + hakuehto + hakutermi);
        return alku + hakuehto + hakutermi;
    }

    const changeMenuTrigger = (filter) => {
        switch (filter) {
            case "pl_name":
                setMenuTriggerText("Planet name");
                break;
            case "hostname":
                setMenuTriggerText("Host star");
                break;
            case "pl_rade":
                setMenuTriggerText("Radius");
                break;
            case "pl_masse":
                setMenuTriggerText("Planet masse");
                break;
                
            default:
                setMenuTriggerText("Search options");
                break;

        }
    }
    
    //Palauttaa hakunäkymän
    return (
        
            <MenuProvider style={{ backgroundColor: '#0E1D32', padding: 5}} on>
                    <View style={styles.searchBar}>
                        <TextInput style={styles.textInput} onChangeText={term => handleTextChange(term)}></TextInput>
                    <TouchableOpacity style ={styles.searchIcon} onPress={() => parseSearchTerms()}>
                        {/*<Text style={styles.buttonText}>Search</Text>*/}
                        <MaterialIcons name="search" size={35} color="white" />
                    </TouchableOpacity>    
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent:'flex-end'}}>
                    <Menu style={styles.menu} onSelect={filter => 
                                    {
                                        setFilter(filter);
                                        changeMenuTrigger(filter);
                                    }}>
                        <MenuTrigger  /*onPress={() => setMenuProviderStyle()}*/ >
                            <Text style={{fontSize: 14, color:'white'}}>{menuTriggerText}</Text>
                        </MenuTrigger>
                        <MenuOptions style={{backgroundColor: '#0E1D32', padding: 10}}>
                            <MenuOption value={"pl_name"}>
                                <Text style={{color:'white', padding: 5}}>Planet name</Text>
                            </MenuOption>
                            <MenuOption value={"hostname"}>
                                <Text style={{color:'white', padding: 5}}>Host star</Text>
                            </MenuOption>

                            <MenuOption value={"pl_rade"}>
                                <Text style={{color:'white', padding: 5}}>Radius</Text>
                            </MenuOption>

                            <MenuOption value={"pl_masse"}>
                                <Text style={{color:'white', padding: 5}}>Planet masse</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    </View>
                    {/*
                    <ScrollView onScroll={({nativeEvent}) => {loadNext(nativeEvent);}} scrollEventThrottle={16}>
                        {renderFoundPlanets()}
                    </ScrollView> */}

                    <FlatList
                        data={foundPlanets}
                        renderItem={({ item }) => (
                            <PlanetBrief navigation={navigation} data={item} allPlanets={foundPlanets} />
                        )}
                        keyExtractor={(item) => item._id}
                    >    
                    </FlatList>
            </MenuProvider>     

    )
}

//Luo id:n planeettakomponenteille
const generateKey = () => {
    const keys = '1234567890abcdefghijklmnopqrstuvwxyz'

    const idLength = 10

    let i = 0;

    let id = '';

    while (i < idLength) {
        id = id + keys.charAt(Math.floor(Math.random() * Math.floor(keys.length)))
        i++;
    }

    return id;
}

//Planeetan kevyet tiedot search-näkymään
//TODO komponentin voinee eriyttää
//TODO infon collapse
//TODO n/a jos tietoa ei ole saatavilla
const PlanetBrief = ( props ) => {

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
                            Host star: { props.data.hostname}
                        </Text>
                        <Text style={styles.infoText}>
                            Masse: { props.data.pl_masse}
                        </Text>
                        <Text style={styles.infoText}>
                            Radius: { props.data.pl_rade}
                        </Text>
                        {/*
                        <Text>
                            Discovery year: { props.data.disc_year}
                        </Text>
                        */}
                    </View>
                    <View style = {styles.buttonWrapper}>
                        <TouchableOpacity style={styles.button} onPress={() => handleStarsystem2(props)}><Text style={styles.buttonText}>View planet</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleStarsystem(props)}><Text style={styles.buttonText}>Stellar System</Text></TouchableOpacity>
                    </View>
                </View>

    return (
        <View style={styles.container}>
            <View style = {styles.headerWrapper} onPress = {toggleVisibility()}>
                <Text style = {styles.header}>
                    { props.data.pl_name }
                </Text>
            </View>
            {renderView()}
        </View>
    )
}

const handleStarsystem = (props,allPlanets) => {
    //console.log(props.allPlanets.length)
    var nimi = props.data.pl_name;
    var kutsu = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+1+st_spectype,st_teff,st_rad,st_mass,st_age,st_rotp+from+pscomppars+where+pl_name+like+\'"+nimi+"\'+order+by+disc_year+desc";
    fetchData(kutsu)
    .then((data) =>{
        var star = setStars(data,props.data.hostname)
        var tahdenplaneetat = props.allPlanets.filter(planet => planet['hostname'].match(star.hostname))
        const system = {star: star, planets: tahdenplaneetat}
        props.navigation.navigate('StarSystem', system)
    })

}
const handleStarsystem2 = (props,allPlanets) => {
    //console.log(props.allPlanets.length)
    var nimi = props.data.pl_name;
    var kutsu = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+1+st_spectype,st_teff,st_rad,st_mass,st_age,st_rotp+from+pscomppars+where+pl_name+like+\'"+nimi+"\'+order+by+disc_year+desc";
    fetchData(kutsu)
    .then((data) =>{
        var star = setStars(data,props.data.hostname)
        var tahdenplaneetat = props.allPlanets.filter(planet => planet['hostname'].match(star.hostname))
        const system = {star: star, planets: tahdenplaneetat}
        props.navigation.navigate('Information',{ planet:props.data, system: system} )
    })

}
const fetchData = async ( props ) => {
    const response = await fetch(props);

    const teksti = await response.text();
    const objects = await parse(teksti);

    const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
    return new Promise((resolve, reject) => {
        var success = planetArray != undefined;
        success ? resolve(planetArray) : reject('Query failed');
    })
}
    
    const setStars = (arr,data) => {
        const star = arr.TD
        const propPlanet =
            {
                hostname: data,
                st_spectype: star[0],
                st_teff: star[1],
                st_rad: star[2],
                st_mass: star[3],
                st_age: star[4],
                st_rotp: star[5]
            }
        return propPlanet
    }
    




const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding:10,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10, 

    },

    textInput: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderTopLeftRadius:10,
        borderBottomLeftRadius: 10,
        padding:12,
        position: 'relative'
    },
    searchIcon: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderTopRightRadius:10,
        borderBottomRightRadius: 10,
        padding: 3

    },

    menuProvider:{
        
    },
    planetScroll:{
        
    },
    searchBar: {
        //backgroundColor: '#0E1D32',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        zIndex:1,
        marginHorizontal: 10,
        marginBottom:10,
        marginTop: 15,
    },

    infoWrapper: {
        justifyContent: "center",
        alignContent: "center",
        flex: 2
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

    header: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#ffff"
    },
    pBrief: {
        backgroundColor: 'white'
    },
    buttonWrapper: {
        //flexDirection: "row",
        alignItems: "stretch",
        
    },

    button:{
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
    menu: {
        width: '40%',
        padding: 10,
        alignItems:'flex-end',
        marginBottom:10
        

    }
});


export default Search;