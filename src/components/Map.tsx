import { GoogleMap, LoadScript } from "@react-google-maps/api";

const Map = () => (
  <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={{ lat: 28.6139, lng: 77.209 }}
      zoom={12}
    />
  </LoadScript>
);

export default Map;
