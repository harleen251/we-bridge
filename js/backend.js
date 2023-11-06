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

export function createApplyButton(eventId) {
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.addEventListener('click', () => {
    console.log("Button ID: " + eventId);
    createPopupForApplication(eventId);
  });
  return applyButton;
}

export function createPopupForApplication(eventId) {
  // Create and display the application popup.
  const popupHTML = `
    <div class="popup">
      <div class="popup-content">
        <h3>Apply for this position</h3>
        <label for="contactNumber">Contact Number:</label>
        <input type="text" id="contactNumber" required>
        <br>
        <label for="applicationReason">Introduce yourself and tell us why you want to volunteer for this opportunity?</label>
        <textarea id="applicationReason" rows="4" required></textarea>
        <br>
        <button id="submitApplication">Submit</button>
        <button id="closePopup">Close</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHTML);
  // Get the pop-up interface and related elements
  const popup = document.querySelector('.popup');
  const closePopup = document.getElementById('closePopup');
  const submitButton = document.getElementById('submitApplication');
  const contactNumberInput = document.getElementById('contactNumber');
  const applicationReasonInput = document.getElementById('applicationReason');

// Close the pop-up interface
  closePopup.addEventListener('click', () => {
    popup.remove();
  });

// Handle click event of submit button
  submitButton.addEventListener('click', () => {
  const contactNumber = contactNumberInput.value;
  const applicationReason = applicationReasonInput.value;

// Here you can submit the data entered by the user to the server or perform other processing
  console.log("Contact Number: " + contactNumber);
  console.log("Application Reason: " + applicationReason);

// Close the pop-up interface
  popup.remove();
 })}

 export function navigateToPostDetailPage(eventId){
  const postDetailPageURL = `../pages/post_detail.html?id=${eventId}`
  window.location.href = postDetailPageURL
}
