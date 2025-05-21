import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { GOOGLE_MAPS_CONFIG, LIBRARIES } from "../commons/GoogleMapsConfig";

/* const LIBRARIES = ["places"]; */

const GoogleMapView = ({ projects }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: LIBRARIES,
    version: GOOGLE_MAPS_CONFIG.version,
  });

  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (projects?.length > 0 && isLoaded) {
      const validProjects = projects.filter((p) => p.lat && p.lng);
      if (validProjects.length === 0) return;

      const avgLat = validProjects.reduce((sum, p) => sum + p.lat, 0) / validProjects.length;
      const avgLng = validProjects.reduce((sum, p) => sum + p.lng, 0) / validProjects.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [projects, isLoaded]);

  if (!isLoaded) return <div className="text-center">Caricamento mappa...</div>;

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={mapCenter || { lat: 40.7259, lng: 8.5556 }} // Sassari
      zoom={mapCenter ? 12 : 12}
      options={{
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        mapTypeId: "satellite",
      }}
    >
      {projects?.map(
        (project) =>
          project.lat &&
          project.lng && (
            <Marker
              key={`marker-${project.id}`}
              position={{ lat: project.lat, lng: project.lng }}
              title={`${project.nomeProgetto} - ${project.indirizzo}`}
            />
          )
      )}
    </GoogleMap>
  );
};

export default GoogleMapView;
