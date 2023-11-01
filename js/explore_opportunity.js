import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, where, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";


const firebaseConfig = {
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"

  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();

const colRef = collection(db, 'posts')

const search = document.getElementById('search');
const output = document.getElementById('eventDetails');
const searchInput = document.getElementById('searchInput');
const interestsSelect = document.getElementById('interests');
const skillsSelect = document.getElementById('skills');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let radius = 10;

search.addEventListener("click", async (e) => {
  e.preventDefault();
  output.innerHTML = ''; // Clear previous results
  const keyWord = searchInput.value.toLowerCase();
  const interests = interestsSelect.value;
  const skills = skillsSelect.value;
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      radius = checkbox.id;
    }
  });
  
  let q;
  if (interests != "Interests") {
    if (skills != "Skills") {
      q = query(colRef, where("skills", "==", skills), where("interests", "==", interests));
    } else {
      q = query(colRef, where("interests", "==", interests));
      console.log(q);
    }
  } else {
    if (skills != "Skills") {
      q = query(colRef, where("skills", "==", skills));
    } else {
      q = colRef;
    }
  }


  try {
    const snapshot = await getDocs(q);
    const matchingDocs = snapshot.docs.filter((doc) => {
      return doc.data().positionTitle.toLowerCase().includes(keyWord);
    });

    matchingDocs.forEach(doc => {

      const event = { ...doc.data(), id: doc.id };        
        if (filteredPostsWithinRadius(event, radius)) {
          
        const div = document.createElement('div');
        div.innerHTML = `<br> Position Title: ${event.positionTitle} 
        <br> Description: ${event.description} 
        <br> Date: ${String(event.date)}
        <br> Location: ${event.location} 
        <br> Post Expiry Date: ${event.expireDate} 
        <br> Interests: ${event.interests}
        <br> Skills: ${event.skills}
        <br> Preferred Language: ${event.preferredLanguage}
        <br> Phone Number:${event.phoneNumber} 
        <br> Email: ${event.email} 
        <br> Hours: ${event.hours}`;
        
        console.log(event)
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
  
        applyButton.addEventListener('click', () => {
          console.log(`Clicked on Apply for event with description: ${event.description}`);
          alert("Applied for the opportunity");
        });
        div.appendChild(applyButton);
        output.appendChild(div);}
        
    });
  } catch (err) {
    console.log(err.message);
  }
   // Clear input fields and reset dropdown values
   searchInput.value = '';
   interestsSelect.value = 'Interests'; // Reset dropdown to default
   skillsSelect.value = 'Skills'; // Reset dropdown to default
});


// Get the volunteer's latitude and longitude coordinates (assuming you have access to them)
const volunteerLatitude = 49.22459940676005;
const volunteerLongitude = -123.10192130145963;
const filteredPostsWithinRadius = (event, radius) => {
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
  }
  
};

 
