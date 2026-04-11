// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { useEffect, useState } from "react";

// const containerStyle = {
//     width: "100%",
//     height: "100%"
// };

// export default function Map({ detailedAddress }) {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: "AIzaSyCyyljJCHmONz_8phA9yT5TqjRbVUvIw1w"
//     });    

//     const [cords, setCords] = useState(null);

//     useEffect(() => {
//         if(!detailedAddress) return;

//         const fetchCords = async () => {
//             const res = await fetch(
//                         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//                             detailedAddress
//                         )}&key=AIzaSyCyyljJCHmONz_8phA9yT5TqjRbVUvIw1w`
//             );

//             const data = await res.json();
//             console.log("Data for Map:\t", data);
            

//             if(data.results.length > 0) {
//                 const location = data.results[0].geometry.location;
//                 setCords(location);
//             }
//         };

//         fetchCords();
//     }, [detailedAddress]);

//     if(!isLoaded) return <p className="flex mx-auto items-center">Loading Map....</p>;
//     if(!cords) return <p className="flex mx-auto items-center">Fetching location....</p>;

//     return (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={cords}
//             zoom={15}
//             >
//                 <Marker position={cords} />
//         </GoogleMap>
//   );
// }

import { GoogleMap, Marker, useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";


const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

export default function Map({ address }) {
    useEffect(() => {
  if (!address || !window.google) return;

  const geocoder = new window.google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK") {
      const loc = results[0].geometry.location;

      const coords = {
        lat: loc.lat(),
        lng: loc.lng(),
      };

      setCenter(coords);
      setMarker(coords);
    }
  });
}, [address]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCyyljJCHmONz_8phA9yT5TqjRbVUvIw1w",
    libraries,
  });

  const searchBoxRef = useRef(null);
  const [center, setCenter] = useState({
    lat: 12.9716, lng: 77.5946,
  });

  const [marker, setMarker] = useState(null);

  const onPlacesChanged = () => {
    if (!searchBoxRef.current) return;

    const places = searchBoxRef.current.getPlaces();

    if(places.length === 0) return;

    const location = places[0].geometry.location;

    const cords = {
        lat: location.lat(),
        lng: location.lng(),
    };

    setCenter(cords);
    setMarker(cords);
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="w-full h-full relative">

      {/* 🔍 Search Box */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[80%]">
        <StandaloneSearchBox
          onLoad={(ref) => {
            if (ref) {
                searchBoxRef.current = ref;
            }
          }}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search location..."
            className="w-full p-2 rounded-xl border shadow"
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}