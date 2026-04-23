//! HIER BITTE WIRKLICH NICHTS ÄNDERN!!!
//! HIER BITTE WIRKLICH NICHTS ÄNDERN!!!
//! HIER BITTE WIRKLICH NICHTS ÄNDERN!!!
//! HIER BITTE WIRKLICH NICHTS ÄNDERN!!!
const readline = require("readline");
const { bestimmeKontoArt } = require("./kontoRegel");   

const users = [
  { name: "Peter", alter: 16, kontoArt: "" },
  { name: "Hans", alter: 18, kontoArt: "" },
  { name: "John", alter: 20, kontoArt: "" },
];

console.log("1", users[0].name);
console.log("2", users[1].name);
console.log("3", users[2].name);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Wähle einen Benutzer aus (1, 2, 3): ", answer => {
  const userID = Number(answer) - 1;
  const benutzer = users[userID];

  if (!benutzer) {
    console.log("Ungültige Auswahl.");
    rl.close();
    return;
  }

  benutzer.kontoArt = bestimmeKontoArt(benutzer.alter);

  console.log(`Name: ${benutzer.name}`);
  console.log(`Alter: ${benutzer.alter}`);
  console.log(`Kontoart: ${benutzer.kontoArt}`);

  rl.close();
});