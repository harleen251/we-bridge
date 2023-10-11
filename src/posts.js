import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const colRef = collection(db, 'posts');

const submitPost = document.getElementById("postForm");

// Function to handle form submission
submitPost.addEventListener("submit", async function (event) {
    event.preventDefault();

    const positionTitle = document.getElementById("txtPositionTitle").value;
    const description = document.getElementById("txtDescription").value;
    const date = document.getElementById("txtDate").value;
    const hours = document.getElementById("txtHours").value;
    const location = document.getElementById("txtLocation").value;
    const expireDate = document.getElementById("txtExpireDate").value;
    const skills = Array.from(document.getElementById("txtSkills").selectedOptions).map(option => option.value);
    const preferredLanguage = document.getElementById("txtPreferredLanguage").value;
    const phoneNumber = document.getElementById("txtPhoneNumber").value;
    const email = document.getElementById("txtEmail").value;
    
   
    try {
        await addDoc(colRef, {
            positionTitle: positionTitle,
            description: description,
            date: date,
            hours: hours,
            location: location,
            expireDate: expireDate,
            skills: skills,
            preferredLanguage: preferredLanguage,
            phoneNumber: phoneNumber,
            email: email
        });

        alert("Post submitted successfully!");

        submitPost.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("An error occurred while submitting the post.");
    }
});
