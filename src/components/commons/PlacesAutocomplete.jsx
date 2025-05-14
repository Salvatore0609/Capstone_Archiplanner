/* import { useRef, useEffect } from "react";

const PlacesAutocomplete = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.autocomplete(inputRef.current, {
      types: ["geocode"], // oppure ["address"] o altro
      componentRestrictions: { country: "it" }, // opzionale
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      } else if (place.name) {
        onChange(place.name);
      }
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="form-control"
      value={value}
      placeholder={placeholder || "Inserisci indirizzo"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default PlacesAutocomplete;
 */
