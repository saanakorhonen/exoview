# Exoview-backend

Serveri, joka sisältää myös tietokannan. Välittää käyttäjälle tietoa eksoplaneetoista, sekä päivittää kuuden tunnin välein planeetat tietokantaan.

## Asennus

Serverin juurihakemisto tarvitsee .env-tiedoston, jossa PORT=8080. Serveri käynnistyy komennolla **npm start**.

## Api ja sen käyttö
Serverin api noudattelee vapaasti REST-tyyppistä APIa. Serveriin otetaan yhteys get-komennolla, jossa määritellään tietokantahaun parametrit.

Parametrit:

searchterm: pakollinen, vapaa tekstihaku. Tietokanta testaa merkkijonon perusteella, kuuluuko jokin tietokannan dokumenteista hakuun.

filter: pakollinen, kenttä jota haetaan. Sallittuja kenttiä ovat tällä hetkellä

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

offset: vapaaehtoinen, aloitusindeksi näytettäville tuloksille. Oletus on 0.

limit: vapaaehtoinen, lopetusindeksi näytettäville tuloksille. Oletus on dokumenttien määrä.

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