// =============================
// Portfolio-Server (app.js)
// =============================
// Dieses Programm startet einen kleinen Webserver für deine eigene Webseite.
// Die Kommentare erklären dir alles Schritt für Schritt. Du kannst nichts kaputt machen – probiere ruhig alles aus!

/*
  Express-Server für deine Webseite
  ================================
  Dieses Skript startet einen kleinen Webserver mit Node.js und Express.
  Damit kannst du deine HTML-, CSS- und JS-Dateien im Browser testen – wie im echten Internet!
  Du kannst den Code beliebig anpassen, eigene Routen hinzufügen und experimentieren.
*/

// 1. Notwendige Module importieren
// Express ist das Framework für den Server
const express = require('express');
// path hilft beim Umgang mit Dateipfaden
const path = require('path');

// 2. Server-Konfiguration
const app = express();
const hostname = 'localhost'; // Lauscht nur auf localhost (127.0.0.1), NICHT im Netzwerk!
const port = 3000; // Hier kannst du den Port ändern, falls nötig

/*
  Das ist alles, was du für einen einfachen Webserver brauchst!
  Du brauchst KEINE Datenbank, KEINE APIs und KEINE extra Funktionen.
  Für Anfänger reicht es, die statischen Dateien (HTML, CSS, JS, Bilder) aus dem "public"-Ordner bereitzustellen.
  
  WICHTIG: Dieser Server ist NUR auf deinem eigenen Computer (localhost) erreichbar, NICHT im Netzwerk!
*/

// 3. Middleware – Statische Dateien bereitstellen
// Damit dein Browser die Webseite sehen kann
app.use(express.static(path.join(__dirname, 'public')));
// Mit diesem Befehl startet der Server und wartet auf Anfragen
app.listen(port, hostname, () => {
  console.log(`Server läuft nur lokal auf http://${hostname}:${port}`);
  // Öffne diese Adresse im Browser, um deine HTML/CSS/JS-Seite zu sehen!
  // Achtung: Andere Geräte im Netzwerk können NICHT darauf zugreifen!
});

/*
  Tipp: Du kannst den Code beliebig verändern und ausprobieren!
  - Passe den Port an, wenn du möchtest
  - Füge eigene statische Dateien in den public-Ordner ein
  - Schau dir die Express-Doku für mehr Möglichkeiten an: https://expressjs.com/de/
*/