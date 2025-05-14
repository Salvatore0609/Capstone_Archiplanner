import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Definisco le librerie come costante ESTERNA al componente per evitare ricaricamenti non necessari
const LIBRARIES = ["places"]; // Mantenuta fuori dal componente per ottimizzare le prestazioni

const GoogleMapView = ({ projects }) => {
  // stato per gestire tutte le posizioni
  const [locations, setLocations] = useState([]);
  // Stato per la posizione centrale della mappa
  /* const [center, setCenter] = useState(null); */
  // Stato per gestire il caricamento
  const [loading, setLoading] = useState(false);
  // Stato per gestire gli errori
  const [error, setError] = useState(null);

  // Ref per l'AbortController per annullare richieste pendenti
  const abortControllerRef = useRef(new AbortController());

  // Caricamento delle API Google Maps con le impostazioni necessarie
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // API key dall'ambiente
    libraries: LIBRARIES, // Utilizza la costante esterna per le librerie
  });

  /* fetchAddress in useEffect:

Usato per visualizzare progetti ESISTENTI sulla mappa

Geocodifica MULTIPLI indirizzi in batch quando il componente viene caricato/aggiornato

Mantiene le coordinate solo nello stato locale del componente */
  useEffect(() => {
    // Esci se le API non sono caricate o non c'è indirizzo
    if (!isLoaded || !projects?.length) return;

    // Annulla eventuali richieste precedenti
    abortControllerRef.current.abort();
    // Crea un nuovo controller per la nuova richiesta
    abortControllerRef.current = new AbortController();

    // Funzione per geocodificare l'indirizzo
    const fetchAddress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Geocodifica tutti gli indirizzi
        const locationsPromises = projects.map(async (project) => {
          // Richiesta alle API di geocoding di Google
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(project.indirizzo)}&key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }`,
            { signal: abortControllerRef.current.signal } // Collegamento all'AbortController
          );
          const data = await response.json();
          // Controllo della risposta
          if (data.status === "OK" && data.results[0]?.geometry?.location) {
            // Estrazione delle coordinate
            const { lat, lng } = data.results[0].geometry.location;
            return { ...project, lat, lng };
          }
          return null;
        });

        const resolvedLocations = (await Promise.all(locationsPromises)).filter(Boolean);
        setLocations(resolvedLocations);
      } catch (err) {
        // Ignora errori di annullamento richiesta
        if (err.name !== "AbortError") {
          setError("Errore durante il caricamento delle posizioni");
        }
      } finally {
        // Fine caricamento
        setLoading(false);
      }
    };

    // Debounce per evitare troppe richieste durante la digitazione
    const timer = setTimeout(fetchAddress, 500);

    return () => {
      // Cleanup: annulla timer e richieste in corso
      clearTimeout(timer);
      abortControllerRef.current.abort();
    };
  }, [isLoaded, projects]); // Esegui effetto quando cambia l'indirizzo o lo stato di caricamento API
  // Calcola il centro medio per lo zoom iniziale
  const calculateCenter = () => {
    if (locations.length === 0) return { lat: 40.7306, lng: 8.5519 };

    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    return { lat: avgLat, lng: avgLng };
  };

  // Stati di rendering condizionale
  if (!isLoaded) return <div>Caricamento mappa...</div>; // API non pronte
  if (error) return <div className="text-danger small">{error}</div>; // Errore di geocoding
  if (loading) return <div>Ricerca in corso...</div>; // Ricerca in corso

  // Render della mappa con i controlli
  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={calculateCenter()}
      zoom={12}
      options={{
        streetViewControl: true, // Mostra controllo Street View
        mapTypeControl: true, // Mostra selezione mappa/satellite
        fullscreenControl: true, // Mostra pulsante fullscreen
      }}
    >
      {/* // Marker nella posizione trovata */}
      {locations.map((project, index) => (
        <Marker key={`marker-${index}`} position={{ lat: project.lat, lng: project.lng }} title={`${project.nomeProgetto} - ${project.indirizzo}`} />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapView;
