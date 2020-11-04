import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Keyboard, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { parse } from 'fast-xml-parser';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import { set } from 'react-native-reanimated';

//Planeettojen etsimisikkuna
const Search = ({ navigation, route } ) => {

    //Aloitusmaksimi queryssa
    var start = 0;

    var alku = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj+from+ps+where+";
	var loppu = "+default_flag+=+1";//format=csv;
	
    

   // var defaultUrl =  'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen+from+pscomppars+where+disc_year+=+2020+and+rownum+>=' + start + '+and+rownum+<' + 9

    //Löydetyt planeetat
    const [foundPlanets, setFoundPlanets] = useState([]) 

    //const [filteredPlanets, setFilteredPlanets] = useState([]) 

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
        setPlanets()
    }, []);

    const setPlanets = () => {
       let arrayP = []
        route.params.map(obj => {
            const planet = obj.TD
            const propPlanet =
            {
                hname: planet[0],
                pname: planet[1],
                pradius: planet[2],
                pmasse: planet[3],
                pl_bmassj: planet[4],
                pl_radj: planet[5],
                pl_orbsmax: planet[6],
                pl_orbper: planet[7],
                pl_orbeccen: planet[8],
                disc_year: planet[9]
            }
            arrayP = arrayP.concat(propPlanet)
        })
        setAllPlanets(arrayP)
    };

    //asetetaan 10 ensimmäistä planeettaa
    useEffect(() => {
        const planets10 = allPlanets.slice(0,10)
        setFoundPlanets(planets10)
    }, [allPlanets])


    //Hakee default-datan tässä vaiheessa
    const fetchData = async ( props ) => {
        const response = await fetch(props);
        //console.log('fetchData',route.params)

        const teksti = await response.text();
        const objects = await parse(teksti);

        const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;

        return new Promise((resolve, reject) => {
            var success = planetArray != undefined;
            success ? resolve(planetArray) : reject('Query failed');
        })
    }


    //Tekee löydetyistä planeetoista katseltavia komponentteja
    const renderFoundPlanets = () => {
        console.log('rendered', foundPlanets)
        /*
        return foundPlanets.map((obj) => {
            let planet = obj.TD;
            const planetProps = {
                hname: planet[0],
                pname: planet[1],
                pradius: planet[2],
                pmasse: planet[3],
                pl_bmassj: planet[4],
                pl_radj: planet[5],
                pl_orbsmax: planet[6],
                pl_orbper: planet[7],
                pl_orbeccen: planet[8],
                disc_year: planet[9]
            }
            
            return <PlanetBrief navigation={navigation} data={planetProps} key={generateKey()}/>
        });*/
        return foundPlanets.map(planet => <PlanetBrief navigation={navigation} data={planet} key={generateKey()}/>)
    }


    //Käsittelee hakutermin ja -filtterin
    const parseSearchTerms = () => {
        /*if(searchTerm === "" && searchFilter === ""){
            
            fetchData(defaultUrl)
            .then((data) => {
                setFoundPlanets(data);
            })
            return;

        } =

        var apikutsu = createQuery();

        fetchData(apikutsu)
        .then((data) => {
            setFoundPlanets(data);
        }) 
        */
 
      const searchedWord = '^' + searchTerm
      const filteredPlanetsAr = (searchFilter !== 'pradius' && searchFilter !== 'pmasse' 
       ? (allPlanets.filter(planet => planet[searchFilter].toLowerCase().match(searchTerm.toLowerCase())))
       : (foundPlanets.filter(planet => planet[searchFilter].toString().match(searchedWord))))

      setFoundPlanets(filteredPlanetsAr)
      Keyboard.dismiss()
    }

    const handleTextChange = (term) => {
        if (term === '') return  setFoundPlanets(allPlanets.slice(0,10))
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

        var hakutermi = '+like+\'' + searchTerm + '%\'+and'
        console.log(alku + hakuehto + hakutermi + /*rajat+*/ loppu);
        return alku + hakuehto + hakutermi + /*rajat+*/ loppu;
    }

    //Lataa seuraavat planeetat, kun on selattu loppuun
    const loadNext = ( props  ) => {
        if (!isAtBottom(props)) return;
        if (searchTerm !== '') return;

        const juokseva = juoksevaluku + 10
        setJuoksevaluku(juokseva)
        //var apikutsu = createQuery(); // TODO=
        console.log('juokseva', juoksevaluku)
        var nextPlanets = allPlanets.slice(juokseva, juokseva + 10)
        setFoundPlanets(foundPlanets.concat(nextPlanets));
        
        /*fetchData(apikutsu)
        .then((data) => {
            setFoundPlanets(foundPlanets.concat(data));
        })*/
    }

    //Katsotaan, onko selaus lopussa
    const isAtBottom = ( props ) => {
        let layout = props.layoutMeasurement.height;
        let offset = props.contentOffset.y;
        let size = props.contentSize.height;

        return layout + offset >= size
    }

    const changeMenuTrigger = (filter) => {
        switch (filter) {
            case "pname":
                setMenuTriggerText("Planet name");
                break;
            case "hname":
                setMenuTriggerText("Host star");
                break;
            case "pradius":
                setMenuTriggerText("Radius");
                break;
            case "pmasse":
                setMenuTriggerText("Planet masse");
                break;
                
            default:
                setMenuTriggerText("Search options");
                break;

        }
    }
    
    //Palauttaa hakunäkymän
    return (
        
            <MenuProvider /*style={padding}*/ on>
                <Menu onSelect={filter => 
                                    {
                                        setFilter(filter);
                                        changeMenuTrigger(filter);
                                    }}>
                        <MenuTrigger /*onPress={() => setMenuProviderStyle()}*/>
                            <Text>{menuTriggerText}</Text>
                        </MenuTrigger>

                        <MenuOptions>
                            <MenuOption value={"pname"}>
                                <Text>Planet name</Text>
                            </MenuOption>
                            
                            <MenuOption value={"hname"}>
                                <Text>Host star</Text>
                            </MenuOption>

                            <MenuOption value={"pradius"}>
                                <Text>Radius</Text>
                            </MenuOption>

                            <MenuOption value={"pmasse"}>
                                <Text>planet masse</Text>
                            </MenuOption>
                        </MenuOptions>

                    </Menu>
                    <View style={styles.searchBar}>
                        <TextInput style={styles.textInput} onChangeText={term => handleTextChange(term)}></TextInput>
                    <TouchableOpacity style={styles.button} onPress={() => parseSearchTerms()}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>    
                    </View>
                    <ScrollView onScroll={({nativeEvent}) => {loadNext(nativeEvent);}} scrollEventThrottle={16}>
                        {renderFoundPlanets()}
                    </ScrollView>

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

    var view =  <View>    
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
                        {/** 
                         * <Text>
                            Discovery year: { props.data.disc_year}
                        </Text>
                        */}
                    </View>
                    <View style = {styles.buttonWrapper}>
                        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Information', props.data)}><Text style={styles.buttonText}>View planet</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View host star</Text></TouchableOpacity>
                    </View>
                </View>

    return (
        <View style={styles.container}>
            <View style = {styles.headerWrapper} onPress = {toggleVisibility()}>
                <Text style = {styles.header}>
                    { props.data.pname }
                </Text>
            </View>
            {renderView()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },

    textInput: {
        width: 200,
        backgroundColor: "gray",
        marginRight: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },

    menuProvider:{
        
    },
    planetScroll:{
        
    },
    searchBar: {
    
        flexDirection: "row",
        justifyContent: "center",
        zIndex:1
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