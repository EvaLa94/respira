import _ from "lodash";

// VARIABLES

const container = document.querySelector(".container");
const searchedCity = document.querySelector(".searchedCity");

const colorArray = [
  "#05d48f", //green
  "#fde153", //yellow
  "#f8a858", //orange
  "#f04a73", //red
  "#b147e6", //purple
  "#7a5f66", //brown-ish
  "#797e85", //gray
];

// Update displayed information

function changeDom(information) {
  cleanContainer();
  generateDomElement(information);
}

// Clean the container by removing exhisting children, if any
function cleanContainer() {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function generateDomElement(information) {
  // Append more information in the div inside the body
  const city = document.createElement("h1");
  const aqi = document.createElement("p");
  const result = document.createElement("h3");
  const feedback = document.createElement("p");

  // Add newly created element a class
  city.classList.add("searchedCity");
  aqi.classList.add("aqi");
  result.classList.add("result");
  feedback.classList.add("feedback");

  const aqiValue = _.get(information, "data.aqi", "-");
  city.textContent = _.get(information, "data.city.name", "Non disponibile");
  aqi.textContent = `AQI: ${aqiValue}`;

  // Append children to DOM
  container.appendChild(city);
  container.appendChild(aqi);
  container.appendChild(result);
  container.appendChild(feedback);

  // Call another function to style the DOM
  styleContainer(aqiValue, aqi, result, feedback);
}

function styleContainer(aqiValue, aqi, result, feedback) {
  if (aqiValue <= 50) {
    aqi.style.background = colorArray[0];
    result.innerHTML = "Buona";
    feedback.innerHTML =
      "La qualità dell'aria è considerata soddisfacente e l'inquinamento atmosferico presenta pochi o nessun rischio.";
  } else if (aqiValue <= 100) {
    aqi.style.background = colorArray[1];
    result.innerHTML = "Moderata";
    feedback.innerHTML =
      "La qualità dell'aria è accettabile; tuttavia, per alcuni inquinanti potrebbe esserci un moderato problema di salute per un numero molto limitato di persone che sono insolitamente sensibili all'inquinamento atmosferico.";
  } else if (aqiValue <= 150) {
    aqi.style.background = colorArray[2];
    result.innerHTML = "Malsana per i soggetti sensibili";
    feedback.innerHTML =
      "I soggetti sensibili possono avere effetti sulla salute. È improbabile che il pubblico in generale ne risenta.";
  } else if (aqiValue <= 200) {
    aqi.style.background = colorArray[3];
    result.innerHTML = "Malsana";
    feedback.innerHTML =
      "Tutti possono iniziare a sperimentare effetti sulla salute; i membri di gruppi sensibili possono subire effetti sulla salute più gravi";
  } else if (aqiValue <= 300) {
    aqi.style.background = colorArray[4];
    result.innerHTML = "Molto malsana";
    feedback.innerHTML =
      "Avvertenze per la salute delle condizioni di emergenza. L'intera popolazione ha maggiori probabilità di essere colpita.";
  } else if (aqiValue > 300) {
    aqi.style.background = colorArray[5];
    result.innerHTML = "Pericolosa";
    feedback.innerHTML =
      "Allerta sulla salute: tutti possono avere effetti sulla salute più gravi";
  } else {
    aqi.style.background = colorArray[5];
    result.innerHTML = "Non disponibile";
    feedback.innerHTML =
      "Non abbiamo dati recenti per la località selezionata.";
  }
}

// EXPORTS
export { container, searchedCity, changeDom, cleanContainer };
