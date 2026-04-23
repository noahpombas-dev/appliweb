//! DU MUSST NUR DIESES DOKUMENT BEARBEITEN


//* Aufgabe: Schreibe hier die if-Abfrage für das Alter
//TODO: Falls der Benutzer 18 ist oder älter dann return Standartkonto, 
//TODO: Falls der Benutzer minderjährig (unter 18) ist, return Jugendkonto. 



//? Ändere diese funktion.
function bestimmeKontoArt(alter) {
    if (alter > 65) {
        return "deintexthier";
    } 
}


//*: Zum überprüfen der Aufgabe, gebe "node main.js" in die Console ein. 
//? Deine Funktion soll für alle drei Benutzer funktionieren.


module.exports = { bestimmeKontoArt }; //! Hier bitte nichts ändern.