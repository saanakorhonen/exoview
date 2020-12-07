const urlPlanets = 'http://192.168.43.209:8080/search?from=planets'
const urlStellarSystem = "http://192.168.43.209:8080/search?filter=hostname&searchterm="


// fetching all expoplanets in the db
const getAllExo = async () => {
    console.log('getalexo')
    const res = await fetch(urlPlanets);
    const data =  await res.json();
    return data
}

// fetching planet's stellar system
const getStellarSystem = async nimi => {
    const hname = nimi.replace(/\+/g, '%2b') // tähdille, joilla + merkki nimessä, jotta haku toimii
    const urlStellar = urlStellarSystem + hname +"&limit=1&from=stars" 

    const res = await fetch(urlStellar);
    const data = await res.json();
    return data[0]
}

export default { getAllExo, getStellarSystem }