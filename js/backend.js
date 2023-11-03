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
            let resultElement = [latitude,longitude]
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

export function setCookie(name, value, days) {
    return new Promise((resolve, reject) => {
      try {
        let expires = "";
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}${expires}; path=/`;
        resolve(); // Resolve the Promise when the cookie is set
      } catch (error) {
        reject(error); // Reject if there's an error in setting the cookie
      }
    });
}

export function getCookie(name) {
    return new Promise((resolve, reject) => {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
  
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          resolve(c.substring(nameEQ.length, c.length));
          return; // Exit the loop once the cookie is found
        }
      }  
      reject(null); // Reject if the cookie is not found
    });
}
