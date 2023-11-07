import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, where, query, orderBy, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getCookie, } from "./backend.js"
const firebaseConfig = {
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"

  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const colRef = collection(db, 'posts');

const search = document.getElementById('search');
const output = document.getElementById('eventDetails');
const searchInput = document.getElementById('searchInput');
const interestsSelect = document.getElementById('interests');
const skillsSelect = document.getElementById('skills');
const radiusRadios = document.querySelectorAll('input[type="radio"][name="radius"]');
let radius = 10;

const defaultQuery = query(colRef, orderBy("date", "desc")); // Default query, ordering by date in descending order

window.addEventListener('load', displayAllPosts);

function displayAllPosts() {
  // Execute the default query
  const q = defaultQuery;

  // Clear the output area
  output.innerHTML = '';

  // Get the query results and display all posts
  getDocs(q)
    .then((snapshot) => {
      snapshot.docs.forEach(doc => {
        const event = { ...doc.data(), id: doc.id };
        radius = getSelectedRadius();
        if (filteredPostWithinRadius(event, radius)) {
          const div = createEventDiv(event);
          output.appendChild(div);
        }
      });
    })
    .catch(err => {
      console.log(err.message);
    });
}


search.addEventListener("click", performSearch);

async function performSearch(e) {
  e.preventDefault();
  output.innerHTML = '';
  const keyWord = searchInput.value.toLowerCase();
  const interests = interestsSelect.value;
  const skills = skillsSelect.value;
  radius = getSelectedRadius();

  const q = createQuery(interests, skills);

  try {
    const snapshot = await getDocs(q);
    const matchingDocs = snapshot.docs.filter((doc) => doc.data().positionTitle.toLowerCase().includes(keyWord));

    matchingDocs.forEach(doc => {
      const event = { ...doc.data(), id: doc.id };
      if (filteredPostWithinRadius(event, radius)) {
        const div = createEventDiv(event);
        output.appendChild(div);
      }
    });
  } catch (err) {
    console.log(err.message);
  }

  resetSearchFields();
}

function getSelectedRadius() {
  const selectedRadio = Array.from(radiusRadios).find(radio => radio.checked);
  return selectedRadio ? parseInt(selectedRadio.value, 10) : 10;
}

function createQuery(interests, skills) {
  let q = colRef;
  if (interests != "Interests") {
    q = query(q, where("interests", "array-contains", interests));
  }
  if (skills != "Skills") {
    q = query(q, where("skills", "array-contains", skills));
  }
  return q;
}
// Get the volunteer's latitude and longitude coordinates (assuming you have access to them)
const volunteerLatitude = 49.22459940676005;
const volunteerLongitude = -123.10192130145963;
function filteredPostWithinRadius(event, radius) {
  if (radius != 0) {
        let postLatitude = event.locationCoordinates._lat;
      let postLongitude = event.locationCoordinates._long;
    
        const earthRadius = 6371; // Earth's radius in kilometers
        // Calculate the distance between the volunteer and the post using Haversine formula
        //  great-circle distance between two points on a sphere 
        const dLat = (postLatitude - volunteerLatitude) * (Math.PI / 180);
        const dLon = (postLongitude - volunteerLongitude) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(volunteerLatitude * (Math.PI / 180)) * Math.cos(postLatitude * (Math.PI / 180)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        console.log('distance is', distance);
        console.log("distance <= radius", distance <= radius);
        let flag =  distance <= radius; // Check if the post is within the specified radius
        if (flag) {
          return flag;
        }
        return 0;
}}

// function createApplyButton(eventId) {
//   const applyButton = document.createElement('button');
//   applyButton.textContent = 'Apply';
//   applyButton.addEventListener('click', () => {
//     console.log("Button ID: " + eventId);
//     createPopupForApplication(eventId);
//   });
//   return applyButton;
// }

function createPopupForApplication(eventId) {
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
  submitButton.addEventListener('click', async () => {
  const contactNumber = contactNumberInput.value;
  const applicationReason = applicationReasonInput.value;
  var currentDate = new Date();
  const docRef = doc(db, "posts", eventId);
  getDoc(docRef)
  .then((doc) => {
    if (doc.exists()) {
      // if document exists, then view the field.
      const organizationId = doc.data().organizationId;
    } else {
      console.log("Document does not exist.");
    }
  })
  .catch((error) => {
    console.error("Error getting document:", error);
  });
  try {
    await addDoc(collection(db, 'application'),{
      contactNumber : contactNumber,
      motive : applicationReason,
      volunteerID : getCookie("volunteerId"),
      postsID : eventId,
      status : "applied",
      organizationId : organizationId,
      dateApplied : currentDate
    });

    alert("Application submitted successfully!")
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("An error occurred while submitting the application.");
  }


// Close the pop-up interface
  popup.remove();
 })}

function navigateToPostDetailPage(eventId){
  const postDetailPageURL = `../pages/post_detail.html?id=${eventId}`
  window.location.href = postDetailPageURL
}

function createEventDiv(event) {
  const div = document.createElement('div');
  const date = new Date(event.date.toDate()); 
  const expireDate = new Date(event.expireDate.toDate()); 
  div.innerHTML = `<br> Position Title: ${event.positionTitle} 
    <br> Description: ${event.description} 
    <br> Date: ${date.toLocaleString()}
    <br> Location: ${event.location} 
    <br> Post Expiry Date: ${expireDate.toLocaleString()} 
    <br> Interests: ${event.interests}
    <br> Skills: ${event.skills}
    <br> Preferred Language: ${event.preferredLanguage}
    <br> Phone Number:${event.phoneNumber} 
    <br> Email: ${event.email} 
    <br> Hours: ${event.hours}`;
    div.addEventListener("click", ()=>{
      navigateToPostDetailPage(event.id);
    })
  // const applyButton = createApplyButton(event.id);
  // div.appendChild(applyButton);
  return div;
}


function resetSearchFields() {
  searchInput.value = '';
  interestsSelect.value = 'Interests';
  skillsSelect.value = 'Skills';
}

