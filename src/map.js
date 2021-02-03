// API KEYS

let airToken = process.env.AIR_TOKEN;
let mapToken = process.env.MAP_TOKEN;

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

//EXPORT
export { airToken, map };
