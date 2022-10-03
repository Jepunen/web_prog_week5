import "./styles.css";
import L from "leaflet";

let pmData = "";
let nmData = "";

const fetchData = async () => {
  const URL =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const res = await fetch(URL);
  const data = await res.json();

  const positiveMigrationURL =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const pmURL = await fetch(positiveMigrationURL);
  pmData = await pmURL.json();

  const negativeMigrationURL =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
  const nmURL = await fetch(negativeMigrationURL);
  nmData = await nmURL.json();

  initializeMap(data);
};

const initializeMap = (data) => {
  var map = L.map("map", {
    minZoom: -3
  });

  let geoJSON = L.geoJSON(data, {
    onEachFeature: getFeature,
    style: {
      weight: 2
    }
  }).addTo(map);

  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  map.fitBounds(geoJSON.getBounds());
};

const getFeature = (feature, layer) => {
  if (!feature.id) return;

  const id = feature.id.split(".")[1];
  const name = pmData.dataset.value[id];
  const name2 = nmData.dataset.value[id];
  //layer.bindPopup("positive: " + name.toString() + "\nnegative: " + name2.toString())
  layer.bindPopup(
    `
    <ul style="list-style: none">
      <li>Positive: ${name.toString()}</li>
      <li>Negative: ${name2.toString()}</li>
    </ul>
    `
  );
  layer.bindTooltip(feature.properties.name);
};

fetchData();
