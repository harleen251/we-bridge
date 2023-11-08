import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, Timestamp, GeoPoint, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { geocodeAddress, getCookie } from "./backend.js"
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



// Retrieve the users' ID from the cookie
let organizationId = ""
getCookie('organizationId')
  .then((cookieValue) => {
    if (cookieValue !== null) {
      // Cookie found, use cookieValue
      if (cookieValue !== "") {
        organizationId = cookieValue;
        console.log(`organizationId value: ${cookieValue}`); 
      }      
    } 
  })
  .catch((error) => {
    //console.error('An error occurred while retrieving the cookie:', error);
  });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(); 

const colRef = collection(db, 'posts');

const submitPost = document.getElementById("postForm");
const skillArray = [];
const interestArray = [];


// Function to handle form submission
submitPost.addEventListener("submit", async function (event) {
    event.preventDefault();

    const positionTitle = document.getElementById("txtPositionTitle").value;
    const description = document.getElementById("txtDescription").value;
    const dateStr = document.getElementById("txtDate").value;
    const date = Timestamp.fromDate(new Date(dateStr))
    const hours = document.getElementById("txtHours").value;
    const location = document.getElementById("txtLocation").value;
    const expireDateStr = document.getElementById("txtExpireDate").value;
    const expireDate = Timestamp.fromDate(new Date(expireDateStr));
    const modeOfWork = document.getElementById("mode_of_work").value
    const availbility = document.getElementById("availbility").value
    const preferredLanguage = document.getElementById("txtPreferredLanguage").value;
    const phoneNumber = document.getElementById("txtPhoneNumber").value;
    const email = document.getElementById("txtEmail").value;
    var currentDate = new Date();
    let docRef
    try {
         docRef = await addDoc(colRef, {
            positionTitle: positionTitle,
            description: description,
            date: date,
            hours: hours,
            location: location,
            expireDate: expireDate,
            mode_of_work: modeOfWork,
            availbility: availbility,
            interests: interestArray,
            skills: skillArray,
            preferredLanguage: preferredLanguage,
            phoneNumber: phoneNumber,
            email: email,
            organizationId: organizationId,
            posted_on_date: currentDate
        });

        alert("Post submitted successfully!");

        submitPost.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("An error occurred while submitting the post.");
    }

    if (location.trim() !== '') {
        console.log(location);
        await geocodeAddress(location)
        .then((result) => {
            const geopoint ={ geopoint: new GeoPoint(result[0], result[1]) };
            const data = {locationCoordinates: geopoint};
            
            setDoc(doc(colRef, docRef.id), data , { merge: true }).then(() => {
                console.log('Address data saved successfully.');
            })
            .catch((error) => {
                console.error('Error saving Address data: ', error);
            });
        })
        .catch((error) => {
            console.error(error); // Handle errors here
        });
    }
 });

choose_interest.addEventListener("click", function (event) {
    option_interest.style.display = "block";
    event.preventDefault();
})

save_interests.addEventListener("click", function (event) {
    event.preventDefault();
    const interest = document.querySelectorAll("#interest input");
    for ( let i of interest) {
        if( i.checked === true ) {
            interestArray.push(i.value);
        }
    }
    console.log(interestArray)
    option_interest.style.display = "none";
})

choose_skill.addEventListener("click", function (event) {
    event.preventDefault();
    option_skill.style.display = "block";
})

save_skill.addEventListener("click", function (event) {
    event.preventDefault();
    const skill = document.querySelectorAll("#skill input");
    for ( let i of skill) {
        if( i.checked === true ) {
            skillArray.push(i.value);
        }
    }
    console.log(skillArray)
    option_skill.style.display = "none";
})
