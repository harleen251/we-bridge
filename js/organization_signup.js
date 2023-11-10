import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { setCookie } from "./backend.js"


const firebassApp = initializeApp({
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
  });

class Organization {
    constructor(txtOrgName,txtEmail,txtFirstName,txtLastName,txtPassword,txtRegNumber){
        this.orgName = txtOrgName;
        this.email = txtEmail;
        this.firstname = txtFirstName;
        this.lastname = txtLastName;
        this.password = txtPassword;        
        this.regNumber = txtRegNumber;
    }
}

// Firestore data converter for Organization
const organizationConverter = {
    toFirestore: function(organization) {
        return {
            orgName: organization.orgName,
            email: organization.email,
            firstname: organization.firstname,
            lastname: organization.lastname,
            password: organization.password,            
            regNumber: organization.regNumber
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Organization(
            data.orgName,
            data.email,
            data.firstname,
            data.lastname,
            data.password,
            data.regNumber,
        );
    }
};

// Reference to Firestore
const db = getFirestore(firebassApp);

// Reference to the volunteer collection
const organizationCollection = collection(db, "organization");
const orgArray = [];
let flag = 0;

async function checkExistingEmail(){
    let hasEmail = false;

    const email = document.getElementById("txtEmail").value.toLowerCase().trim();

    const q = query(organizationCollection, where("email", "==", email));
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

async function saveOrganization(){
    const organizationData  = new Organization(txtOrgName.value,txtEmail.value,txtFirstName.value,txtLastName.value,txtPassword.value,txtRegNumber.value);    
    const emailExists = await checkExistingEmail();
    
    if( flag === 1 && !emailExists) {        
        // Save the data to Firestore
        await addDoc(organizationCollection.withConverter(organizationConverter), organizationData)       
        .then((docRef) => {
            const organizationId =  docRef.id;
            // Save the volunteer ID in a cookie
            setCookie("idOrganization", organizationId, 1); // Expires in 7 days
            setCookie("organizationId", organizationId, 1);
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
        saveOrganization();    
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
    const pageURL = "organization_build_profile.html";
    window.location.href = pageURL;
})

document.getElementById("skip_profile").addEventListener("click", function (event) {
    event.preventDefault();    
    const prevUrl = document.referrer;
    let redirectURL = "organization_signup.html"
  
    if (prevUrl !== ""){
      redirectURL = document.referrer;
    }

    // Successful login, redirect to the login page with the redirect parameter
    window.location.href = redirectURL;
})
