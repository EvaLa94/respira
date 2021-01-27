// VARIABLES

let airToken = process.env.AIR_TOKEN;
let mapToken = process.env.MAP_TOKEN;
const container = document.querySelector(".container");
const searchedCity = document.querySelector(".searchedCity");
const submitBtn = document.querySelector(".submit-button");
const locationBtn = document.querySelector(".location-button");

let searchString;

const colorArray = [
  "#05d48f", //green
  "#fde153", //yellow
  "#f8a858", //orange
  "#f04a73", //red
  "#b147e6", //purple
  "#7a5f66", //brown-ish
  "#797e85", //gray
];

// MAP
let coordinates = [45.4642, 9.19];
const osmLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapToken,
  }
);

const waqiLayer = L.tileLayer(
  "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token={accessToken}",
  {
    attribution:
      'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>',
    accessToken: airToken,
  }
);

const map = L.map("map").setView(coordinates, 11);
map.addLayer(osmLayer).addLayer(waqiLayer);

// EVENT LISTENERS
submitBtn.addEventListener("click", searchStart);
locationBtn.addEventListener("click", getCurrentLocation);

// FUNCTIONS

// Update displayed information

function testF(information) {
  // remove exhisting children, if any
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }

  // Append more information in the div inside the body
  const city = document.createElement("h1");
  const aqi = document.createElement("p");
  const result = document.createElement("h3");
  const feedback = document.createElement("p");

  city.classList.add("searchedCity");
  aqi.classList.add("aqi");
  result.classList.add("result");
  feedback.classList.add("feedback");

  const aqiValue = information.data.aqi;
  city.textContent = information.data.city.name;
  aqi.textContent = `AQI: ${aqiValue}`;

  container.appendChild(city);
  container.appendChild(aqi);
  container.appendChild(result);
  container.appendChild(feedback);

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

// Search info based on input city
function searchStart(event) {
  event.preventDefault();
  searchString = searchedCity.value;

  fetch("https://api.waqi.info/feed/" + searchString + "/?token=" + airToken)
    .then((result) => result.json())
    .then((info) => {
      testF(info);
      // Update map center
      map.setView(
        {
          lat: `${info.data.city.geo[0]}`,
          lng: `${info.data.city.geo[1]}`,
        },
        11
      );
    })
    .catch((error) => createError());
}

// Use geolocalisation to get user's current location
function getCurrentLocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition((position) => {
    searchString = `geo:${position.coords.latitude};${position.coords.longitude}`;

    // Update map center
    map.setView(
      {
        lat: `${position.coords.latitude}`,
        lng: `${position.coords.longitude}`,
      },
      11
    );

    fetch("https://api.waqi.info/feed/" + searchString + "/?token=" + airToken)
      .then((result) => result.json())
      .then((info) => testF(info))
      .catch((error) => createError());
  });
}

// Handle errors
function createError() {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }

  const errorTitle = document.createElement("h2");
  const errorMessage = document.createElement("p");

  errorTitle.classList.add("error-title");
  errorMessage.classList.add("error-message");

  errorTitle.innerHTML = "ERRORE";
  errorMessage.innerHTML =
    "Mi dispiace, non è presente una stazione di rilevamento della qualità dell'aria nella località cercata. Effettua una nuova ricerca!";

  container.appendChild(errorTitle);
  container.appendChild(errorMessage);
}
