import { initializeApp} from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, withConverter} from 'firebase/firestore'

const firebassApp = initializeApp({
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
  });

class Volunteer {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

const volunteerConverter = {
    toFirestore: function(volunteer) {
        return {
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            email: volunteer.email,
            password: volunteer.password
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Volunteer(
            data.firstName,
            data.lastName,
            data.email,
            data.password,
        );
    }
};

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

// Reference to Firestore
const db = getFirestore(firebassApp);

// Reference to the volunteer collection
const volunteerCollection = collection(db, "volunteer");


const volunteerArray = [];
let flag = 0;

async function checkExistingEmail(){
    let hasEmail = false;

    const email = document.getElementById("txtEmail").value.toLowerCase().trim();

    const q = query(volunteerCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);  

    if (!querySnapshot.empty) {
        // Get the volunteer ID from Firestore 
        
        const volunteerId = querySnapshot.docs[0].id;
        alert("Email already exist! " + volunteerId);
        hasEmail = true;

    } else {
        // document.getElementById("message").textContent = "Invalid email or password.";
    }
    return hasEmail;
}

async function saveVolunteer(){
    const volunteerData  = new Volunteer(txtFirstName.value,txtLastName.value,txtEmail.value,txtPassword.value);      
    const emailExists = await checkExistingEmail();
    
    if( flag === 1 && !emailExists) {        
        // Save the data to Firestore
        await addDoc(volunteerCollection.withConverter(volunteerConverter), volunteerData)       
        .then((docRef) => {
            const volunteerId =  docRef.id;
            // Save the volunteer ID in a cookie
            setCookie("volunteerId", volunteerId, 1); // Expires in 7 days
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        }); 

        let welcome = document.getElementById("welcome");
        welcome.style.display = "block";       
    } else {        
        // alert("Passwords do not match. Please try again.");
    }
    
}

const form_SignUp = document.getElementById("signUp_Form")
form_SignUp.addEventListener("submit", function (event){
    event.preventDefault();
    try {
        saveVolunteer();    
    } catch (error) {
        
    }
})

document.getElementById("txtConfirmPassword").addEventListener("keyup", function (event) {
    event.preventDefault();
    if(txtPassword.value === txtConfirmPassword.value) {
        msg.innerHTML = `Passwords match`;
        flag = 1;
    } else {
        msg.innerHTML = `Passwords do not match`;
        flag = 0;
    }
})

document.getElementById("txtPassword").addEventListener("keyup", function (event) {
    event.preventDefault();
    if((txtPassword.value === txtConfirmPassword.value) && (txtConfirmPassword.value !== "")) {
        msg.innerHTML = `Passwords match`;
        flag = 1;
    } else {
        if( (txtConfirmPassword.value !== "") ){
            msg.innerHTML = `Passwords do not match`;
            flag = 0;
        }
    }
})

document.getElementById("build_profile").addEventListener("click", function (event) {
    event.preventDefault();
    const pageURL = "volunteer_build_profile.html";
    window.location.href = pageURL;
})

document.getElementById("skip_profile").addEventListener("click", function (event) {
    event.preventDefault();    
    const prevUrl = document.referrer;
    let redirectURL = "volunteer_signup.html"
  
    if (prevUrl !== ""){
      redirectURL = document.referrer;
    }

    // Successful login, redirect to the login page with the redirect parameter
    window.location.href = redirectURL;
})



