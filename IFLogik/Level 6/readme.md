Aufgabe: Input anzeigen (Level 7)

Du hast ein Eingabefeld, einen Button und ein < p>-Element.
Dein Ziel ist es, den Text aus dem Input-Feld anzuzeigen, wenn der Button geklickt wird.


Als hilfe kannst du dies benutzen.
```html
<input id="text" type="text">
<button id="button" type="button" onclick="showText()">Submit</button>
<p id="resultat">hi</p>
```
Deine Aufgaben:

1. Erstelle eine Funktion showText()
    - Diese Funktion soll ausgeführt werden, wenn der Button geklickt wird.

2. Hole den aktuellen Wert aus dem Input-Feld
    - Tipp: Du brauchst nicht innerHTML

3. Setze den Text in das < p>-Element
    - Der Inhalt von #resultat soll genau dem entsprechen, was im Input steht

- Wichtige Hinweise:
    - Werte aus dem Input immer erst beim Klick holen, nicht vorher!


4. Bonus-Aufgaben:
    - Zeige "Bitte etwas eingeben" an, wenn das Feld leer ist
    - Ändere die Farbe des Textes, wenn etwas eingegeben wurde