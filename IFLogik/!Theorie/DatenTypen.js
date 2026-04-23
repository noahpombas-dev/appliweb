//* Datentypen



// =========== 
// Strings:  =
// =========== 
//? Ein String kann nur Text enthalten.
let nachricht = "Ich habe 200 Franken auf dem Konto.";
//! Achtung: man kann auch Zahlen hinzufügen, jedoch gelten diese als Text. 
// Heisst "1" plus "1" ergibt 11 denn, beide sind Texte. Also werden sie nur zusammengestell.



// =========== 
// Array:    =
// =========== 
//? Ein Array hat mehere Daten in einer Variable

//* Beispiel:
let komponenten = ['Laptop', 'Tastatur', 'Mouse', 'HeadSet', 'Microfon']
// Um Komponenten hier rauszuschreiben könnte man folgendes benutzen
komponenten[0] //* wäre Laptop
komponenten[1] //* wäre Tastatur
//! Beim zählen fängt man bei 0.



// =========== 
// Integer:  = 
// =========== 
//? Ein INTEGER/INT kann nur eine Gerade Zahl sein, ohne Kommastellen.
let int = 1;
//* Da dies ein INTEGER ist, würde 1 plus 1 gleich 2 ergeben. Da wir hier Zahlen addieren und nicht Texte. 



// =========== 
// Float:    =
// =========== 
//? Ein Float ist eine Zahl mit unendlichen Kommastellen.
//* Beispiel: 
let pi = 3.1415926535;



// =========== 
// Double:   =
// =========== 
//? Ein Double ist eine Zahl mit nur zwei Kommastellen.
//* Beispiel: 
let piDouble = 3.14; // Franken




// =========== 
// BOOLEAN:  =
// ===========
//? Ein BOOL kann nur false oder true sein.
//* Beispiel: 
let istBenutzerAktiv = false; //! Benutzer ist nicht Aktiv
let istVolljährig = true; //! Benutzer ist volljährig

//? In manche andere Programmiersprachn kann es vorkommen das es anstatt ein BOOL (BOOLEAN), BITS verwendet werden.
//? Da funktioniert das gleiche prinzip, anstatt false true, benutzt man 0/1
//* 0 = False
//* 1 = True 
