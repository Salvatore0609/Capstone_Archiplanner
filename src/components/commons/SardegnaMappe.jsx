import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SardegnaMap = () => {
  // Definisco un elenco di “layer WMS” con relative etichette
  const wmsOptions = [
    { label: "Ortofoto 2019", layers: "raster:ortofoto_2019" },
    { label: "Ortofoto 1968", layers: "raster:ortofoto_1968" },
    { label: "PPR 2006 - Zonizzazione", layers: "sitr:IDT_SU20G_ZONIZZAZIONE" },
    { label: "Aree Tutelate", layers: "sitr:IDT_SU20G_AREE_TUTELATE" },
    { label: "Catasto – Acque", layers: "cat:ACQUECATASTO" },
    // …altri layer
  ];

  // Stato per il WMS layer corrente
  const [currentLayer, setCurrentLayer] = useState(wmsOptions[0].layers);

  // Coordinate e zoom di partenza (centro Sardegna)
  const center = [40.0, 9.0];
  const zoom = 8;

  return (
    <div>
      {/* Dropdown per selezionare il layer WMS */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="selectWmsLayer" style={{ marginRight: "0.5rem" }}>
          Seleziona vista:
        </label>
        <select id="selectWmsLayer" value={currentLayer} onChange={(e) => setCurrentLayer(e.target.value)}>
          {wmsOptions.map((opt) => (
            <option key={opt.layers} value={opt.layers}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mappa Leaflet con layer WMS */}
      <MapContainer center={center} zoom={zoom} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://webgis.regione.sardegna.it/geoserver/ows?"
          layers={currentLayer}
          format="image/png"
          transparent={true}
          version="1.3.0"
        />
      </MapContainer>
    </div>
  );
};

export default SardegnaMap;
