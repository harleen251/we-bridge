import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs  , query, where} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { setCookie } from "./backend.js"

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
var volunteerCollection = collection(db, "volunteer");

async function signIn() {

  const prevUrl = document.referrer; // previous page link
  let redirectURL = "index.html"

  if (prevUrl !== ""){
    redirectURL = document.referrer;
  }
  
  const email = document.getElementById("txtEmail").value.toLowerCase().trim();
  const password = document.getElementById("txtPsw").value;

  const q = query(volunteerCollection, where("email", "==", email), where("password", "==", password));
  const querySnapshot = await getDocs(q);  

  if (!querySnapshot.empty) {
    // Get the volunteer ID from Firestore 
    
    const volunteerId = querySnapshot.docs[0].id;

    // Save the volunteer ID in a cookie
    await setCookie("volunteerId", volunteerId, 1); // Expires in 7 days

    // Successful login, redirect to the login page with the redirect parameter
    window.location.href = redirectURL;
  } else {
    alert("Invalid email or password.");
    // document.getElementById("message").textContent = "Invalid email or password.";
  }
}

document.getElementById("btnLoginVol").addEventListener("click", function (event) {
  event.preventDefault();
  signIn();  
});
