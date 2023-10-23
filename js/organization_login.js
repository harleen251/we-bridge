import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs  , query, where} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// Initialize Firebase 
const firebassApp = initializeApp({
  apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
  authDomain: "webridge-81f09.firebaseapp.com",
  projectId: "webridge-81f09",
  storageBucket: "webridge-81f09.appspot.com",
  messagingSenderId: "950961168294",
  appId: "1:950961168294:web:1cc48025ccfb341ea93967",
  measurementId: "G-VWM7GNP66X"
});

// Reference to Firestore
var db = getFirestore(firebassApp);

// Reference to the volunteer collection
var organizationCollection = collection(db, "organization");

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

async function signIn() {

  const prevUrl = document.referrer;
  let redirectURL = "organization_signup.html"

  if (prevUrl !== ""){
    redirectURL = document.referrer;
  }
  
  const email = document.getElementById("txtEmail").value.toLowerCase().trim();
  const password = document.getElementById("txtPsw").value;

  const q = query(organizationCollection, where("email", "==", email), where("password", "==", password));
  const querySnapshot = await getDocs(q);  

  if (!querySnapshot.empty) {
    // Get the volunteer ID from Firestore 
    
    const organizationId = querySnapshot.docs[0].id;
    alert(organizationId);

    // Save the volunteer ID in a cookie
    setCookie("organizationId", organizationId, 1); // Expires in 7 days

    // Successful login, redirect to the login page with the redirect parameter
    window.location.href = redirectURL;
  } else {
    alert("Invalid email or password.");
    // document.getElementById("message").textContent = "Invalid email or password.";
  }
}

document.getElementById("btnLogin").addEventListener("click", function (event) {
  event.preventDefault();
  signIn();  
});

//// Function to get the value of a cookie by its name
// function getCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(';');
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

// // Retrieve the user's ID from the cookie
// const volunteerId = getCookie("volunteerId");

// class Volunteer {
//     constructor (name, state, country ) {
//         this.name = name;
//         this.state = state;
//         this.country = country;
//     }
//     toString() {
//         return this.name + ', ' + this.state + ', ' + this.country;
//     }
// }

// // Firestore data converter
// const volunteerObj = {
//     toFirestore: (Volunteer) => {
//         return {
//             name: Volunteer.name,
//             state: Volunteer.state,
//             country: Volunteer.country
//             };
//     },
//     fromFirestore: (snapshot, options) => {
//         const data = snapshot.data(options);
//         return new Volunteer(data.name, data.state, data.country);
//     }
// };