// IMPORTS
import { container, searchedCity, changeDom, cleanContainer } from "./view.js";
import { airToken, map } from "./map.js";
import _ from "lodash";

// VARIABLES
const submitBtn = document.querySelector(".submit-button");
const locationBtn = document.querySelector(".location-button");
let searchString;

// EVENT LISTENERS
submitBtn.addEventListener("click", searchStart);
locationBtn.addEventListener("click", getCurrentLocation);

// Search info based on input city
function searchStart(event) {
  event.preventDefault();
  searchString = searchedCity.value;

  fetch("https://api.waqi.info/feed/" + searchString + "/?token=" + airToken)
    .then((result) => result.json())
    .then((info) => {
      changeDom(info);
      // Update map center
      map.setView(
        {
          lat: _.get(info, "data.city.geo[0]", "45.4642"),
          lng: _.get(info, "data.city.geo[1]", "9.19"),
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
      .then((info) => changeDom(info))
      .catch((error) => createError(error));
  });
}

// Handle errors
function createError(error) {
  cleanContainer();

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
