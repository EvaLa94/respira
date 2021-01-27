(() => {
  let e = process.env.AIR_TOKEN;
  const t = document.querySelector(".container"),
    a = document.querySelector(".searchedCity"),
    i = document.querySelector(".submit-button"),
    n = document.querySelector(".location-button");
  let o;
  const s = [
      "#05d48f",
      "#fde153",
      "#f8a858",
      "#f04a73",
      "#b147e6",
      "#7a5f66",
      "#797e85",
    ],
    l = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.MAP_TOKEN,
      }
    ),
    r = L.tileLayer(
      "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token={accessToken}",
      {
        attribution:
          'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>',
        accessToken: e,
      }
    ),
    c = L.map("map").setView([45.4642, 9.19], 11);
  function d(e) {
    for (; t.firstChild; ) t.removeChild(t.lastChild);
    const a = document.createElement("h1"),
      i = document.createElement("p"),
      n = document.createElement("h3"),
      o = document.createElement("p");
    a.classList.add("searchedCity"),
      i.classList.add("aqi"),
      n.classList.add("result"),
      o.classList.add("feedback");
    const l = e.data.aqi;
    (a.textContent = e.data.city.name),
      (i.textContent = `AQI: ${l}`),
      t.appendChild(a),
      t.appendChild(i),
      t.appendChild(n),
      t.appendChild(o),
      l <= 50
        ? ((i.style.background = s[0]),
          (n.innerHTML = "Buona"),
          (o.innerHTML =
            "La qualità dell'aria è considerata soddisfacente e l'inquinamento atmosferico presenta pochi o nessun rischio."))
        : l <= 100
        ? ((i.style.background = s[1]),
          (n.innerHTML = "Moderata"),
          (o.innerHTML =
            "La qualità dell'aria è accettabile; tuttavia, per alcuni inquinanti potrebbe esserci un moderato problema di salute per un numero molto limitato di persone che sono insolitamente sensibili all'inquinamento atmosferico."))
        : l <= 150
        ? ((i.style.background = s[2]),
          (n.innerHTML = "Malsana per i soggetti sensibili"),
          (o.innerHTML =
            "I soggetti sensibili possono avere effetti sulla salute. È improbabile che il pubblico in generale ne risenta."))
        : l <= 200
        ? ((i.style.background = s[3]),
          (n.innerHTML = "Malsana"),
          (o.innerHTML =
            "Tutti possono iniziare a sperimentare effetti sulla salute; i membri di gruppi sensibili possono subire effetti sulla salute più gravi"))
        : l <= 300
        ? ((i.style.background = s[4]),
          (n.innerHTML = "Molto malsana"),
          (o.innerHTML =
            "Avvertenze per la salute delle condizioni di emergenza. L'intera popolazione ha maggiori probabilità di essere colpita."))
        : l > 300
        ? ((i.style.background = s[5]),
          (n.innerHTML = "Pericolosa"),
          (o.innerHTML =
            "Allerta sulla salute: tutti possono avere effetti sulla salute più gravi"))
        : ((i.style.background = s[5]),
          (n.innerHTML = "Non disponibile"),
          (o.innerHTML =
            "Non abbiamo dati recenti per la località selezionata."));
  }
  function u() {
    for (; t.firstChild; ) t.removeChild(t.lastChild);
    const e = document.createElement("h2"),
      a = document.createElement("p");
    e.classList.add("error-title"),
      a.classList.add("error-message"),
      (e.innerHTML = "ERRORE"),
      (a.innerHTML =
        "Mi dispiace, non è presente una stazione di rilevamento della qualità dell'aria nella località cercata. Effettua una nuova ricerca!"),
      t.appendChild(e),
      t.appendChild(a);
  }
  c.addLayer(l).addLayer(r),
    i.addEventListener("click", function (t) {
      t.preventDefault(),
        (o = a.value),
        fetch("https://api.waqi.info/feed/" + o + "/?token=" + e)
          .then((e) => e.json())
          .then((e) => {
            d(e),
              c.setView(
                { lat: `${e.data.city.geo[0]}`, lng: `${e.data.city.geo[1]}` },
                11
              );
          })
          .catch((e) => u());
    }),
    n.addEventListener("click", function (t) {
      t.preventDefault(),
        navigator.geolocation.getCurrentPosition((t) => {
          (o = `geo:${t.coords.latitude};${t.coords.longitude}`),
            c.setView(
              { lat: `${t.coords.latitude}`, lng: `${t.coords.longitude}` },
              11
            ),
            fetch("https://api.waqi.info/feed/" + o + "/?token=" + e)
              .then((e) => e.json())
              .then((e) => d(e))
              .catch((e) => u());
        });
    });
})();
