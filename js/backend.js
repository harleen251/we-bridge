const apiKey = 'OmC103AhDFXzt9AsnXs55I4Ij9rzxFIw';

export function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}`;
  
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const location = data.results[0].position;
            const latitude = location.lat;
            const longitude = location.lon;
            let resultElement = `Coordinates: Latitude ${latitude}, Longitude ${longitude}`;
            resolve(resultElement);
          } else {
            reject('Address not found. Please check the address and try again.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          reject('An error occurred. Please try again later.');
        });
    });
}