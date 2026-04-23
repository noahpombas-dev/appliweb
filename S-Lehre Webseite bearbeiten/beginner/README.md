# Deine erste eigene Webseite – Schritt für Schritt# Dein erstes Portfolio-Projekt (beginner)

Willkommen im Beginner-Ordner! Hier kannst du ganz einfach lernen, wie Webseiten funktionieren. Alles ist ausführlich und freundlich kommentiert – perfekt für den Einstieg in HTML, CSS, JavaScript und das Testen mit einem kleinen Webserver.

---

## Was ist in diesem Ordner?

- **app.js** – Ein super einfacher Express-Server. Damit kannst du deine Webseite lokal (auf deinem eigenen Computer) anschauen, als wäre sie schon im Internet.
- **public/** – Hier liegen alle Dateien, die im Browser angezeigt werden:
  - **index.html** – Deine Startseite, mit vielen Erklärungen.
  - **style.css** – Die Gestaltung deiner Seite, Schritt für Schritt erklärt.
  - **script.js** – JavaScript für Interaktivität, mit motivierenden Beispielen.

---

## Wie startest du deine eigene Webseite?

1. **Installiere Node.js** (falls noch nicht geschehen).
2. **Öffne ein Terminal** (z.B. Eingabeaufforderung oder PowerShell) und gehe in den `beginner`-Ordner.
3. **Starte den Server:**
   ```
   node app.js
   ```
4. **Öffne deinen Browser** und gehe zu:
   - http://localhost:3000
   
   Der Server ist nur auf deinem eigenen Computer (localhost) erreichbar. Andere Geräte im Netzwerk können NICHT darauf zugreifen.

---

## Was macht jede Datei?

### app.js
- Startet einen einfachen Webserver mit [Node.js](https://nodejs.org/) und [Express](https://expressjs.com/de/).
- Der Server stellt alle Dateien aus dem `public`-Ordner im Browser bereit – wie im echten Internet.
- Die Konfiguration erfolgt direkt im Code:
  - `hostname = '0.0.0.0'` lässt Zugriffe von allen Geräten im lokalen Netzwerk zu.
  - `port = 3000` ist der Standard-Port, kann aber angepasst werden.
- Du kannst den Code beliebig verändern, z.B. eigene statische Dateien hinzufügen oder den Port ändern.
- Viele Kommentare im Code erklären dir alles Schritt für Schritt.

---

## Wie funktioniert app.js?

1. **Module importieren:**
   - Express (Webserver-Framework)
   - path (für Dateipfade)
2. **Server konfigurieren:**
   - Erstellt eine Express-App, setzt Hostname und Port.
3. **Statische Dateien bereitstellen:**
   - Mit `express.static()` werden alle Dateien aus dem `public`-Ordner im Browser angezeigt.
4. **Server starten:**
   - Mit `app.listen()` startet der Server und zeigt im Terminal die Adresse an.

**Tipp:**
- Du kannst nichts kaputt machen – probier alles aus!
- Passe Port oder Hostname an, wenn du möchtest.
- Füge eigene HTML-, CSS-, JS-Dateien in `public/` hinzu.
- Siehe die Kommentare in `app.js` oder die [Express-Dokumentation](https://expressjs.com/de/) für mehr Möglichkeiten.

### public/index.html
- Das ist die eigentliche Webseite.
- Alles, was du hier schreibst, siehst du im Browser.
- Du kannst Überschriften, Texte, Buttons usw. einfügen.

### public/style.css
- Hier bestimmst du das Aussehen: Farben, Schrift, Abstände, usw.
- Du kannst alles ausprobieren und sofort sehen, was sich ändert.

### public/script.js
- Hier kannst du die Seite "lebendig" machen.
- Zum Beispiel: Wenn du auf einen Button klickst, erscheint eine Nachricht.

---

## Schritt 3: Probiere es aus!

- Ändere die Überschrift in `index.html` und lade die Seite neu.
- Ändere die Hintergrundfarbe in `style.css`.
- Schreibe in `script.js` eine neue Zeile, z.B.:
  ```js
  alert('Hallo, das ist ein Test!');
  ```
  Speichere und lade die Seite neu.

---

## Häufige Fragen

**Was ist ein Server?**
> Ein Programm, das Webseiten ausliefert. Hier ist es "app.js".

**Was ist HTML?**
> Die Sprache, mit der Webseiten gebaut werden. Sie beschreibt, was auf der Seite steht.

**Was ist CSS?**
> Damit wird das Aussehen der Seite festgelegt (Farben, Schrift, Layout).

**Was ist JavaScript?**
> Damit kannst du die Seite interaktiv machen (z.B. auf Klicks reagieren).

---

## Tipp für Einsteiger
- Du kannst nichts kaputt machen! Probier alles aus.
- Wenn du etwas nicht verstehst, schau dir die Kommentare in den Dateien an.
- Frag jemanden oder suche im Internet nach "HTML Tutorial", "CSS Tutorial" oder "JavaScript Tutorial".

Viel Spaß beim Ausprobieren!
