import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FaSearch } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { MdGpsFixed } from "react-icons/md";
import Style from "./Map.module.css";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";


function ChangeLocation({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 35);
  }, [center, map]);

  return null;
}

function Map({clinics = []}) {
  const [position, setPosition] = useState([17.6131, 121.7270]); // Tuguegarao City

  function goTo(coord = []) {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your brownser.");
      return;
    }

    if (coord.length === 0) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          alert("unable to retrive your location.");
        }
      )

      return;
    }

    setPosition([coord[0], coord[1]]);
  }

  const [currentClinic, setCurrentClinic] = useState("");
  const [showClinic, setShowClinic] = useState(false);
  const showClinics = clinics?.map((clinic) => {
    return (
      <li onClick={() => { setShowClinic(false); goTo(clinic.coord); setCurrentClinic(clinic.clinic_name)}} className={Style.clinic} key={clinic.clinic_name}>{clinic.clinic_name}</li>
    )
  });



return (
    <section className={Style.mapOC}>
    {clinics?.length > 0 && (
      <ol className={Style.clinicContainer}>
        <li onClick={() => setShowClinic(prev => !prev)}>Clinics</li>
        {showClinic && showClinics}
    </ol>)}
    
      <MapContainer
        center={position}
      zoom={13}
      onClick={() => setShowClinic(false)}
    >
      <ChangeLocation center={position}></ChangeLocation>
      
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={position}>
          <Popup>You are here!</Popup>
        </Marker>
      </MapContainer>
    <MdGpsFixed className={Style.gps} onClick={() => goTo()} title="My Location" />
    <a
      href={`https://www.google.com/maps/search/${encodeURIComponent(currentClinic)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Use Google Map instead
    </a>
    </section>
  );
}

export default Map;