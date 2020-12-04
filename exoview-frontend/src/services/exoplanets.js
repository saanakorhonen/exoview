const urlPlanets = 'http://address:8080/search?from=planets'
const urlStellarSystem = "http://address:8080/search?filter=hostname&searchterm="


// fetching all expoplanets in the db
const getAllExo = async () => {
    console.log('getalexo')
    const res = await fetch(urlPlanets);
    const data =  await res.json();
    return data
}

// fetching planet's stellar system
const getStellarSystem = async nimi => {
    const urlStellar = urlStellarSystem + nimi+"&limit=1&from=stars" 
    const res = await fetch(urlStellar);
    const data = await res.json();
    return data[0]
}

export default { getAllExo, getStellarSystem }