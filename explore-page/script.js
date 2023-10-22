import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

let events = []


getDocs(colRef)
  .then((snapshot) => {
    snapshot.docs.forEach(doc => {
      events.push({ ...doc.data(), id: doc.id })
    })
    console.log(events)
    let output = document.getElementById('eventDetails');
    events.forEach(event => {      
      const div = document.createElement('div');
      div.innerHTML = `<br> Date: ${String(event.date)} <br> Description: ${event.description} <br> Email: ${event.email} <br> Location: ${event.location} <br> Phone Number:${event.phoneNumber} <br> Position Title: ${event.positionTitle}<br> Post Expiry Date: ${event.expireDate} <br> Preferred Language: ${event.preferredLanguage}<br> Skills: ${event.skills}<br>  Hours: ${event.hours} <br>`; 

      // Create an "Apply" button for each event
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';

    applyButton.addEventListener('click', () => {
      console.log(`Clicked on Apply for event with description: ${event.description}`);
      alert("Applied for the opportunity")
    });
      output.appendChild(div);
      output.appendChild(applyButton);
    });
  })
  .catch(err => {
    console.log(err.message)
  })

  

 
