// Initialize the map
const map = L.map('map').setView([47.8095, 13.0550], 13);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Layers storage
const layers = {};
let activeLayer = null;

// Utility to create Leaflet icon
function createIcon(fileName) {
  return L.icon({
    iconUrl: `images/${fileName}`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
  });
}

// STUDY
fetch('data/study.geojson')
  .then(res => res.json())
  .then(data => {
    const studyLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const type = feature.properties.amenity === 'library' ? 'library.png' : 'university.png';
        return L.marker(latlng, { icon: createIcon(type) });
      },
      onEachFeature: createPopup
    });
    layers["study"] = studyLayer;
  });

// HOUSING
fetch('data/housing.geojson')
  .then(res => res.json())
  .then(data => {
    layers["housing"] = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createIcon("home.png") }),
      onEachFeature: createPopup
    });
  });

// HELP (subfilterable)
let helpData = null;
const helpLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) => {
    const type = feature.properties.amenity || "help";
    return L.marker(latlng, { icon: createIcon(`${type}.png`) });
  },
  onEachFeature: createPopup
});
layers["help"] = helpLayer;

fetch('data/help.geojson')
  .then(res => res.json())
  .then(data => {
    helpData = data;
    filterHelp("hospital");
  });

// RELAX (subfilterable)
let relaxData = null;
const relaxLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) => {
    return L.marker(latlng, { icon: createIcon(getRelaxIcon(feature)) });
  },
  onEachFeature: createPopup
});
layers["relax"] = relaxLayer;

fetch('data/relax.geojson')
  .then(res => res.json())
  .then(data => {
    relaxData = data.features.filter(f => f.properties.name?.trim() !== "");
    filterRelax("park");
  });

function getRelaxIcon(feature) {
  const leisure = feature.properties.leisure;
  const sport = feature.properties.sport;

  if (leisure === "dog_park") return "dog_park.png";
  if (leisure === "pitch" && (sport === "football" || sport === "soccer")) return "football.png";
  if (leisure === "pitch" && sport === "tennis") return "tennispitch.png";
  if (leisure === "pitch") return "pitch.png";
  if (leisure === "swimming_pool") return "swimmingpool.png";
  return "park.png";
}

// EAT (subfilterable)
let eatData = null;
const eatLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) => {
    const iconFile = `${feature.properties.amenity}.png`;
    return L.marker(latlng, { icon: createIcon(iconFile) });
  },
  onEachFeature: createPopup
});
layers["eat"] = eatLayer;

fetch('data/eatndrink.geojson')
  .then(res => res.json())
  .then(data => {
    eatData = data;
    filterEat("restaurant");
  });

/* ---------------- Toggle Functions ---------------- */

// Generic layer toggle
function toggleLayer(key) {
  for (const k in layers) {
    if (map.hasLayer(layers[k])) map.removeLayer(layers[k]);
  }
  hideAllSubfilters();

  if (layers[key]) {
    map.addLayer(layers[key]);
    activeLayer = key;
  } else {
    activeLayer = null;
  }
}

// Hide all subfilter panels
function hideAllSubfilters() {
  document.getElementById("eat-subfilter").style.display = "none";
  document.getElementById("help-subfilter").style.display = "none";
  document.getElementById("relax-subfilter").style.display = "none";
}

// Special toggles
function toggleEat() {
  const sub = document.getElementById("eat-subfilter");
  if (activeLayer === "eat") {
    toggleLayer(null);
    sub.style.display = "none";
  } else {
    toggleLayer("eat");
    sub.style.display = "block";
  }
}
function toggleHelp() {
  const sub = document.getElementById("help-subfilter");
  if (activeLayer === "help") {
    toggleLayer(null);
    sub.style.display = "none";
  } else {
    toggleLayer("help");
    sub.style.display = "block";
  }
}
function toggleRelax() {
  const sub = document.getElementById("relax-subfilter");
  if (activeLayer === "relax") {
    toggleLayer(null);
    sub.style.display = "none";
  } else {
    toggleLayer("relax");
    sub.style.display = "block";
  }
}

/* ---------------- Subfilter Functions ---------------- */

// EAT subfilter
function filterEat(type) {
  eatLayer.clearLayers();
  if (!eatData) return;

  const filtered = {
    ...eatData,
    features: eatData.features.filter(f => f.properties.amenity === type)
  };

  eatLayer.addData(filtered);
}

// HELP subfilter
function filterHelp(type) {
  helpLayer.clearLayers();
  if (!helpData) return;

  const filtered = {
    ...helpData,
    features: helpData.features.filter(f => f.properties.amenity === type)
  };

  helpLayer.addData(filtered);
}

// RELAX subfilter
function filterRelax(type) {
  relaxLayer.clearLayers();
  if (!relaxData) return;

  const matchesType = f => {
    const leisure = f.properties.leisure;
    const sport = f.properties.sport;

    if (type === "dog_park") return leisure === "dog_park";
    if (type === "football") return leisure === "pitch" && (sport === "football" || sport === "soccer");
    if (type === "tennis") return leisure === "pitch" && sport === "tennis";
    if (type === "swimming") return leisure === "swimming_pool";
    if (type === "pitch") return leisure === "pitch" && !sport;
    return leisure === "park";
  };

  relaxLayer.addData({
    type: "FeatureCollection",
    features: relaxData.filter(matchesType)
  });
}

/* ---------------- Popup ---------------- */

function createPopup(feature, layer) {
  const props = feature.properties;
  const name = props.name || 'Unnamed Location';
  const type = props.amenity || props.leisure || props.building || props.office || 'Location';

  const website = props.website || props["contact:website"];
  const phone = props.phone || props["contact:phone"];
  const email = props.email || props["contact:email"];
  const address = [props["addr:street"], props["addr:housenumber"], props["addr:city"]]
    .filter(Boolean)
    .join(" ");

  const popupContent = `
    <strong>${name}</strong><br>
    <em>${type}</em><br>
    ${address ? `📍 <strong>Address:</strong> ${address}<br>` : ''}
    ${props.opening_hours ? `⏰ <strong>Open:</strong> ${props.opening_hours}<br>` : ''}
    ${phone ? `📞 <strong>Phone:</strong> ${phone}<br>` : ''}
    ${email ? `📧 <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>` : ''}
    ${website ? `🔗 <a href="${website}" target="_blank">Website</a><br>` : ''}
  `;

  layer.bindPopup(popupContent.trim());
  if (props.name) layer.bindTooltip(props.name);
}
