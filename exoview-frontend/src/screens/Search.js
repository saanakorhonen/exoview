import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {  FlatList, Keyboard, View, Text, TextInput, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import { MaterialIcons } from '@expo/vector-icons';
import PlanetBrief from '../components/PlanetBrief'

//Planeettojen etsimisikkuna
const Search = ({ navigation, route } ) => {


    //Löydetyt planeetat
    const [foundPlanets, setFoundPlanets] = useState([]) 

    const [allPlanets, setAllPlanets] = useState([])

    //Hakufiltteri
    const [searchFilter, setFilter] = useState('')

    //Hakutermi
    const [searchTerm, changeSearchTerm] = useState('')

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


    //Käsittelee hakutermin ja -filtterin
    const parseSearchTerms = () => {
        
        if(searchTerm === "" || searchFilter === ""){ 
            Keyboard.dismiss(); 
            setFilter(""); 
            setMenuTriggerText('Search Options'); 
            return setFoundPlanets(allPlanets);
        }
        
        var searchedWord = '^' + searchTerm + '.*';

        if (searchedWord.indexOf('+') > -1) {
            const index = searchedWord.indexOf('+');
            
            searchedWord = searchedWord.substring(0, index) + '\\' + searchedWord.substring(index, searchedWord.length); 
        }

        console.log(searchedWord);

        const filteredPlanetsAr = (searchFilter !== 'pl_rade' && searchFilter !== 'pl_masse' 

        ? (allPlanets.filter(planet => planet[searchFilter].match(new RegExp(searchedWord, 'gi'))))
        : (allPlanets.filter(planet => planet[searchFilter].toString().match(new RegExp(searchedWord, "gi")))))

        setFoundPlanets(filteredPlanetsAr)
        Keyboard.dismiss()

    }

    const handleTextChange = (term) => {
        if (term === '') {
            //setFilter(""); 
            //setMenuTriggerText('Search Options'); 
            setFoundPlanets(allPlanets);

        }
        changeSearchTerm(term)
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
                        keyExtractor={(item) => item._id}>    
                    </FlatList>
            </MenuProvider>     
    )
}

//Planeetan kevyet tiedot search-näkymään
//TODO komponentin voinee eriyttää
//TODO infon collapse
//TODO n/a jos tietoa ei ole saatavilla



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
        borderRadius: 10,
        padding:12,
        position: 'relative'
    },
    searchIcon: {
        marginLeft: 5

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