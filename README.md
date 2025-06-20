
# Interactive Web Map – Salzburg Student Guide

This is an interactive web map created using the Leaflet.js library. It is designed as a helpful visual guide for students in the city of Salzburg, showing categorized locations for studying, eating & drinking, housing, relaxation, and essential services.

## 🌍 Project Title
**"Salzburg Student Essentials Map"**

## 📍 Live Map
[View the Live Map Here](https://fh50841.github.io/student-life-map/)  


---

## 📌 Features

- 📌 **Layer-style categories** for Study, Eat & Drink, Housing, Relax, and Help & Services.
- 🧭 **Interactive popups** with descriptions for each location.
- 🖱️ **Mouse-over effects** to highlight interactivity.
- 📊 **Custom marker icons** and styling.
- 🌐 **Base map** provided by OpenStreetMap via Leaflet.
- 🎨 Clean, accessible UI for desktop screens.

---

## 👥 Target Users

This map is primarily designed for:
- New and existing students in Salzburg
- Visitors who want a curated overview of essential locations
- University staff offering support services to students

---

## 🗃️ Data Sources

- Custom GeoJSON files created from manually selected Points of Interest (POIs) in Salzburg.
- OpenStreetMap base layer.
- Data manually validated for accuracy and usability.

---

## 🛠️ Technologies Used

- [Leaflet.js](https://leafletjs.com/)
- HTML5 / CSS3 / JavaScript
- GeoJSON for spatial data
- GitHub Pages for hosting

---

## 📂 Project Structure

```
student-life-map/
├── index.html
├── css/
|    ├── style.css
├── data/
│   ├── study.geojson
│   ├── eatndrink.geojson
│   ├── housing.geojson
│   ├── relax.geojson
│   └── help.geojson
|── js/
    |──main.js
├── images/
│   └── custom-icons.png
```

---

## 🚀 Getting Started

To run the map locally:
1. Clone the repo or download the ZIP.
2. Open `index.html` in your browser.



---

## 💡 Design Decisions

- Used warm colors for inviting UX.
- Prioritized legibility and spatial clarity.
- Button-styled categories simulate "layer" control for visual simplicity.
- Custom icons improve accessibility for non-expert map users.

---

## 🔄 Potential Improvements

- Add real-time search or filtering options.
- Expand coverage beyond Salzburg center.
- Include routing or directions using Leaflet Routing Machine.
- Mobile responsiveness adjustments.

---

## 📚 Reflection

This project helped deepen my understanding of:
- Web-based mapping workflows
- Leaflet library customization
- Managing and visualizing spatial data with GeoJSON
- Web publishing with GitHub Pages

---

## 🔗 Resources & References

- [Leaflet Documentation](https://leafletjs.com/)
- [UW Cart Lab GitHub](https://github.com/uwcartlab/webmapping)
- [Instructor’s basic example](https://github.com/keskinmer/basicleafletmap)

---

## 🧑‍💻 Author

- Name: DINA ALHUSAINI
- University: FH Salzburg
- Course: Information Visualization – Summer 2025
