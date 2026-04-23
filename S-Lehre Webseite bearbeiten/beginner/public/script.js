// 1. Wir holen uns den Container, wo alles drinsteht
const container = document.getElementById('container');

// 2. Wir holen uns das Element, wo die Lieblingsfarbe angezeigt wird
const favColorElement = document.getElementById('favColor');

// 3. Wir holen uns das Element, wo die Nachricht angezeigt wird
const messageElement = document.getElementById('message');

// Funktion zum Zentrieren (optional, CSS macht es schon)
function centerContent() {
  const windowHeight = window.innerHeight; // Höhe des Fensters
  const windowWidth = window.innerWidth;   // Breite des Fensters
  const containerHeight = container.offsetHeight; // Höhe des Inhalts
  const containerWidth = container.offsetWidth;   // Breite des Inhalts

  // Setze Abstand oben und links, damit alles zentriert ist
  // container.style.marginTop = ((windowHeight - containerHeight) / 2) + 'px';
  // container.style.marginLeft = ((windowWidth - containerWidth) / 2) + 'px';
}

// Wird beim Laden und beim Ändern der Fenstergröße aufgerufen
window.onload = centerContent;
window.onresize = centerContent;

// Funktion, die aufgerufen wird, wenn ein Button geklickt wird
// color ist z. B. 'rot', 'blau' oder 'gelb'
function changeColor(color) {
  // Ändert den Text im Lieblingsfarbe-Element
  favColorElement.textContent = color;

  // Zeigt eine Nachricht an, die sagt, was passiert ist
  messageElement.textContent = `Du hast die Farbe ${color} ausgewählt.`;
}
