// setze das Zeit limit
let zeit = 60;

// verschiedenen Text die abgetippt werden können
let erwartungen = [
  "Für die Schüler ein Vorbild: Paul Aurin ist Oberhavels Lehrer des Jahres 2019",
  "Herzlich Willkommen am Marie-Curie-Gymnasium.",
  "Hinten oder vorne is egal, es muss schnell gehen - Frau Miehe",
  "Ihr dürft alles machen, was ihr wollt, ihr dürft euch nur nicht erwischen lassen. -Henry Köhn",
  "Ihr bekommt die Arbeiten nicht und ich muss auch nicht begründen, warum. - Frau Reimann",
  "Ich guck öfter auf die Uhr als auf die Tafel - Maximilian Stieglitz 2018",
  "Ich mach mir ne Kerze an dann bin ich nicht so allein hier - Martinik",
  "Ein asymmetrisches Chiffresystem ist ein asymmetrisches Chiffresystem bei dem ein asymmetrisches Chiffresystem zum Verschlüsseln und ein asymmetrisches Chiffresystem ein sogenanntes asymmetrisches Chiffresystem zum entschlüsseln benutzt wird.",
  "die der und in zu den das nicht von sie ist des sich mit dem dass er es ein ich auf so eine auch als an nach wie im für man aber aus durch wenn nur war noch werden bei hat wir was wird sein einen welche sind oder zur um haben einer mir über ihm diese einem ihr uns da zum kann doch vor dieser mich ihn du hatte seine mehr am denn nun unter sehr selbst schon hier bis habe ihre dann ihnen seiner alle wieder meine Zeit gegen vom ganz einzelnen wo muss ohne eines können sei",
];

// benötigte elemente ziehen
let timer_text = document.querySelector("#timer");
let wpm_text = document.querySelector("#wpm");
let cpm_text = document.querySelector("#cpm");
let fehler_text = document.querySelector("#fehler");
let genauigkeit_text = document.querySelector("#genauigkeit");
let erwartung_feld = document.querySelector("#erwartung");
let input_feld = document.querySelector("#input");

let anzeige = document.querySelector("#anzeige");

let runde = 0;
let zeit_left = zeit;
let anzahl_fehler = 0;
let fehler = 0;
let genauigkeit = 1;
let anzahl_buchstaben = 0;
let buchstaben = 0;
let erwartung = "";
let timer = null;
localStorage["rekorde"] = [0, 0, 0]

// neuer Text der abgetippt werden muss wird angezeitgt
function neueErwartung() {
    let zufall = Math.floor(Math.random()*erwartungen.length);
    erwartung_feld.textContent = null;
    erwartung = erwartungen[zufall];

    // trenne Zeichen um sie später in css zu bearbeiten
    erwartung.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        erwartung_feld.appendChild(charSpan)
    })
}
// nimmt den derzeitigen Text und verarbeitet ihn
function verarbeiteInput() {
  // derzeitiger Text
  input = input_feld.value;
  input_array = input.split('');
  buchstaben = input.length;
  // fehler in dem derzeitigen text
  fehler = 0;
  // für jeden buchstaben der erwartet wird
  erwartungArray = erwartung_feld.querySelectorAll('span');
  erwartungArray.forEach((char, index) => {
    let buchstabe = input_array[index]
    // wenn noch nicht so weit, keine markierung
    if (buchstabe == null) {
        char.classList.remove('richtig');
        char.classList.remove('falsch');
    }
    // richtiger buchstabe markiere grün
    else if (buchstabe === char.innerText) {
        char.classList.add('richtig');
        char.classList.remove('falsch');
    }
    // falscher buchstabe markiere rot und erhöhe fehler
    else {
        char.classList.add('falsch');
        fehler++;
    }
  });
  
  // update die anzahl an fehlern
  fehler_text.textContent = anzahl_fehler + fehler;

  // update die genauigkeit
  let richtige_buchstaben = (anzahl_buchstaben+buchstaben)-(anzahl_fehler + fehler);
  let genauigkeit = ((richtige_buchstaben / (anzahl_buchstaben+buchstaben)) * 100);
  genauigkeit_text.textContent = Math.round(genauigkeit) + "%";

  // wenn erwartung ganz getippt ist
  if (input.length == erwartung.length) {
    neueErwartung();
    // leere das Input Feld
    input_feld.value = "";
    anzahl_fehler += fehler
    anzahl_buchstaben += buchstaben
    buchstaben = 0;
    fehler = 0;
  }
}

// update timer und statistiken
function update(){
    updateTimer();
    updateStatistik();
}

function updateTimer() {
  // wenn Zeit übrig
  if (zeit_left > 0) {
    // verringere übrige zeit
    zeit_left--;
    // update den timer auf der seite
    timer_text.textContent = zeit_left + "s";
  }
  else {
    // beende das spiel
    ende();
  }
}
// update cpm und wpm auf der seite
function updateStatistik() {
    // formel für cpm: richtige buchstaben / zeit in min
    cpm = Math.round((anzahl_buchstaben+buchstaben-anzahl_fehler-fehler)*60 / (zeit-zeit_left));
    cpm_text.textContent = cpm;
    // formel für wpm: cpm / 5
    wpm_text.textContent = cpm/5;
}

// beendet die Runde
function ende() {
  // stoppe den Timer
  clearInterval(timer);
  // disable das input Feld
  input_feld.disabled = true;
  
  updateStatistik();
  // leere textfeld
  input_feld.textContent = "tippe hier...";
  // prüfe ob wert in die rekord kommt
  updateRekorde(parseInt(wpm_text.textContent));
  displayRekorde();

  // warte 1s bevor neues spiel möglich
  setTimeout(function(){
      input_feld.disabled = false;
      input_feld.value = "";
  }, 1000)
}

function start() {
    // setze Werte zurück
    resetWerte();
    // neuer Text zum abtippen
    neueErwartung();
    // zeige Statistiken
    anzeige.style.display = "flex";

    // starte Timer neu
    clearInterval(timer);
    timer = setInterval(update, 1000);
}

function resetWerte() {
  // setze werte zurück
  zeit_left = zeit;
  fehler = 0;
  anzahl_fehler = 0;
  genauigkeit = 0;
  anzahl_buchstaben = 0;
  erwartung_zahl = 0;
  input_feld.disabled = false;

  input_feld.value = "";
  genauigkeit_text.textContent = 100;
  timer_text.textContent = zeit_left + 's';
  fehler_text.textContent = 0;
}

function updateRekorde(wert) {
    let rekorde = localStorage["rekorde"].split(",");
    // füge dem array den wert hinzu
    rekorde.push(wert);
    // sortiere das array in absteigender reihenfolge
    rekorde.sort(function(a, b) {
        return b-a;
    });
    // speichere die ersten drei Werte als Array
    localStorage["rekorde"] = rekorde.slice(0, 3);
}

function displayRekorde() {
    // ziehe rekorde aus dem localStorage
    let rekorde = localStorage["rekorde"];
    // nehm das Rekorde html feld
    let rekorde_feld = document.querySelector("#rekorde");
    // mache es sichtbar falls es noch nicht ist
    rekorde_feld.style.display = "grid";
    // enferne alte rekorde von der anzeige
    rekorde_feld.innerHTML = '<div id="rekorde-kopf">Rekorde</div>';
    // füge die neuen hinzu
    rekorde.split(',').forEach((rekord, index) => {
        const rekordSpan = document.createElement('span');
        // wird dann so aussehen
        // 1.       60 wpm
        rekordSpan.innerText = index+1 + ".     " + rekord + " wpm";
        // füge klasse hinzu für die Formatierung
        rekordSpan.classList.add("rekord-feld");
        
        rekorde_feld.appendChild(rekordSpan);
    });
}