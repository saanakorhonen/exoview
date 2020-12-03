# Exoview-backend

Serveri, joka sisältää myös tietokannan. Välittää käyttäjälle tietoa eksoplaneetoista, sekä päivittää kuuden tunnin välein planeetat tietokantaan.

## Asennus

Serverin juurihakemisto tarvitsee .env-tiedoston, jossa PORT=8080 ja CLIENT_PORT=80. Serveri käynnistyy komennolla **npm start**.

## Clientien yhdistäminen

Clientit yhdistyvät porttiin 80. Uuden planeetan löytyessä clienteille lähetetään objekti:

```
const newPlanetInfo = {
    name: pl_name
    id: id
}
```

, jossa name sisältää uuden planeetan nimen ja id planeetan id:n.

## Api ja sen käyttö

Serverin api noudattelee vapaasti REST-tyyppistä APIa. Serveriin otetaan yhteys get-komennolla, jossa määritellään tietokantahaun parametrit. Serverin ymmärtämä komento on search, jonka jälkeen lisätään parametrit.
search/id mahdollistaa id:n perusteella hakemisen.

Parametrit:

from: pakollinen, etsittävän collectionin nimi. Serverissä käytössä tällä hetkellä **"planets"** ja **"stars"**.

searchterm: vapaaehtoinen, vapaa tekstihaku. Tietokanta testaa merkkijonon perusteella, kuuluuko jokin tietokannan dokumenteista hakuun. Jos joko searchterm tai filter puuttuu, palautetaan kaikki entryt (oletushaku)

filter: vapaaehtoinen, kenttä jota haetaan. Sallittuja kenttiä ovat tällä hetkellä

planets:
    "hostname"
    "pl_name"
    "pl_rade"
    "pl_masse"
    "pl_bmassj"
    "pl_radj"
    "pl_orbsmax"
    "pl_orbper"
    "pl_orbeccen"
    "disc_year"
    "dateAdded"

stars:
    "hostname"
    "st_spectype"
    "st_teff"
    "st_rad"
    "st_mass"
    "st_lum"
    "st_age"
    "st_dens"
    "st_rotp"
    "st_radv"
    "sy_bmag"
    "sy_vmag"
    "planetIds"

offset: vapaaehtoinen, aloitusindeksi näytettäville tuloksille. Oletus on 0.

limit: vapaaehtoinen, lopetusindeksi näytettäville tuloksille. Oletus on dokumenttien määrä.

exact_match: 0 tai 1. Jos 1 niin haetaan täsmällistä nimeä, esim. Kepler-160 haussa ei palauta Kepler-1607:aa.

sortField: vapaaehtoinen, määrittää järjestysfunktiossa käytettävän kentän. Filterissä sallitut kentät ovat sallittuja myös sortFieldissä.

sortDirection: vapaaehtoinen, määrittää järjestämisen suunnan. -1 on laskeva, 1 on nouseva.

sortField ja sortDirection muodostavat seurvaan objektin.

```
  sort = {
      sortField: "disc_year",
      direction: -1
  }
```

Oletuksena yllämainittu esimerkkiobjekti, mikäli joko sortFieldiä tai sortDirectionia ei ole annettu.

## Lisenssi

Joskus

This research has made use of the NASA Exoplanet Archive, which is operated by the California Institute of Technology, under contract with the National Aeronautics and Space Administration under the Exoplanet Exploration Program.

These data are made available to the community through the Exoplanet Archive on behalf of the KELT project team.
