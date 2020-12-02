const urlPlanets = 'http://172.20.10.2:8080/search?from=planets'
const urlStellarSystem = "http://172.20.10.2:8080/search?filter=hostname&searchterm="

// fetching all expoplanets in the db
const getAllExo = async () => {
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

export default {getAllExo, getStellarSystem}