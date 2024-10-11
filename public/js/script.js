const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      handleGeolocationError(error); // Handle geolocation errors
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 2500,
    }
  );
} else {
  // Geolocation is not supported by the browser
  alert("Geolocation is not supported by your browser.");
}

// Error handling function
function handleGeolocationError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Location access is denied. Please allow location services to use this feature.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get your location timed out.");
      break;
    default:
      alert("An unknown error occurred while trying to access your location.");
      break;
  }
}

const map = L.map("map").setView([0, 0], 10); // Initial map view, could set to default location if needed

L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("recive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 15);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Corrected method name (was setLatLong)
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    console.log("Disconnected from server");
  }
});

