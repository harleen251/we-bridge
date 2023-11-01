import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, setDoc} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js';

const firebassApp = initializeApp({
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
  });

const storage = getStorage();

  // Function to get the value of a cookie by its name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Reference to Firestore
const db = getFirestore(firebassApp);

// Reference to the volunteer collection
const organizationCollection = collection(db, "organization");

// Retrieve the user's ID from the cookie
const organizationId = getCookie("organizationId");

async function getOrganizationInfo(){
    const docRef = doc(organizationCollection, organizationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const organizationData = docSnap.data();
        console.log("Document data:", organizationData);
        document.getElementById("profilePic").src = (organizationData.photoLink == null ? " " : organizationData.photoLink);
        document.getElementById('txtEmail').value = organizationData.email;
        document.getElementById('txtOrgName').value = (organizationData.orgName == null ? " " : organizationData.orgName);
        document.getElementById('txtRegNumber').value = (organizationData.regNumber == null ? " " : organizationData.regNumber);
        document.getElementById('txtFirstName').value = (organizationData.firstName == null ? " " : organizationData.firstName);
        document.getElementById('txtLastName').value = (organizationData.lastName == null ? " " : organizationData.lastName);
        document.getElementById('txtAddress').value = (organizationData.address == null ? " " : organizationData.address);
        document.getElementById('txtProvince').value = (organizationData.province == null ? " " : organizationData.province);
        document.getElementById('txtCity').value = (organizationData.city == null ? " " : organizationData.city);
        document.getElementById('txtPostalCode').value = (organizationData.postalCode == null ? " " : organizationData.postalCode);
        document.getElementById('txtDescription').value = (organizationData.description == null ? " " : organizationData.description);
        document.getElementById('txtWebsiteLink').value = (organizationData.websiteLink == null ? " " : organizationData.websiteLink);
        document.getElementById('txtPhoneNumber').value = (organizationData.phoneNumber == null ? " " : organizationData.phoneNumber);

        if (organizationData.service != null) {
            let service = organizationData.service;
            service.forEach(element => {
                console.log(element);
                const checkbox = document.querySelector(`input[value="${element}"]`);
                //serviceArray.push(element);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }       
        
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}
  
  // Call the function when the window loads
window.onload = getOrganizationInfo();

class Organization {
    constructor( 
        txtOrgName,
        txtRegNumber,
        txtAddress,
        txtProvince,
        txtCity,
        txtPostalCode,
        txtDescription,
        txtWebsiteLink,
        service,
        txtFirstName,
        txtLastName,
        txtEmail,
        txtPhoneNumber
    ){
        this.orgName = txtOrgName;
        this.regNumber = txtRegNumber;
        this.address = txtAddress;
        this.province = txtProvince;
        this.city = txtCity;
        this.postalCode = txtPostalCode;
        this.description = txtDescription;
        this.websiteLink = txtWebsiteLink;
        this.service = service;
        this.firstName = txtFirstName;
        this.lastName = txtLastName;
        this.email = txtEmail;
        this.phoneNumber = txtPhoneNumber;
    }
}

const organizationConverter = {
    toFirestore: function(organization) {
        return {
            orgName: organization.orgName,
            regNumber: organization.regNumber,
            address: organization.address,
            province: organization.province,
            city: organization.city,
            postalCode: organization.postalCode,
            description: organization.description,
            websiteLink: organization.websiteLink,
            service: organization.service,
            firstName: organization.firstName,
            lastName: organization.lastName,
            email: organization.email,
            phoneNumber: organization.phoneNumber,
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Organization(
            data.orgName,
            data.regNumber,
            data.address,
            data.province,
            data.city,
            data.postalCode,
            data.description,
            data.websiteLink,
            data.service,
            data.firstName,
            data.lastName,
            data.email,
            data.phoneNumber
        );
    },
};

const orgArray = [];
const serviceArray = [];
let flag = 0;

const form_Profile = document.getElementById("form_Profile")
form_Profile.addEventListener("submit", function (event){
    event.preventDefault();    
    try {
        saveOrganization();
    } catch (error) {
        
    }
});

async function saveOrganization(){
    const prevUrl = document.referrer; // previous page link
    let redirectURL = "index.html"

    if (prevUrl !== ""){
        redirectURL = document.referrer;
    }
    const txtOrgName = form_Profile.querySelector("#txtOrgName");
    const txtRegNumber = form_Profile.querySelector("#txtRegNumber");
    const txtAddress = form_Profile.querySelector("#txtAddress");
    const txtProvince = form_Profile.querySelector("#txtProvince");
    const txtCity = form_Profile.querySelector("#txtCity");
    const txtPostalCode = form_Profile.querySelector("#txtPostalCode");
    const txtDescription = form_Profile.querySelector("#txtDescription");
    const txtWebsiteLink = form_Profile.querySelector("#txtWebsiteLink");
    const txtFirstName = form_Profile.querySelector("#txtFirstName");
    const txtLastName = form_Profile.querySelector("#txtLastName");
    const txtEmail = form_Profile.querySelector("#txtEmail");
    const txtPhoneNumber = form_Profile.querySelector("#txtPhoneNumber");

    const service = document.querySelectorAll("#service input");
    for ( let i of service) {
        if( i.checked === true ) {
            serviceArray.push(i.value);
        }
    }

    const org = new Organization(txtOrgName.value,txtRegNumber.value,txtAddress.value,txtProvince.value,txtCity.value,txtPostalCode.value,txtDescription.value,txtWebsiteLink.value,serviceArray,txtFirstName.value,txtLastName.value,txtEmail.value,txtPhoneNumber.value,);

    const docRef = doc(organizationCollection, organizationId).withConverter(organizationConverter);
    await setDoc(docRef, org, { merge: true }).then(() => {
        console.log('Organization data saved successfully.');
        alert(redirectURL);
        window.location.href = redirectURL;
    })
    .catch((error) => {
        console.error('Error saving Organization data: ', error);
    });
}

choose_service.addEventListener("click", function (event) {
    event.preventDefault();
    option_service.style.display = "block";
})

save_service.addEventListener("click", function (event) {
    event.preventDefault();
    // const service = document.querySelectorAll("#service input");
    // for ( let i of service) {
    //     if( i.checked === true ) {
    //         serviceArray.push(i.value);
    //     }
    // }
    option_service.style.display = "none";
});

const fileInput = document.getElementById("txtPhotoLink");
// const uploadButton = document.getElementById("uploadButton");


fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const fileName = file.name;

    const imageRef = ref(storage, "profile-pictures/organization/" + fileName);

    // uploadButton.disabled = true; // Disable the button during upload

    uploadBytes(imageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(imageRef).then((downloadURL) => {
            profilePic.src = downloadURL;
            const expRef = doc(organizationCollection, organizationId);
            setDoc(expRef, {photoLink : downloadURL}, { merge: true }).then(() => {
                console.log('PhotoLink data saved successfully.');
            })
            .catch((error) => {
                console.error('Error saving PhotoLink data: ', error);
            });
            // uploadButton.disabled = false; // Re-enable the button after successful upload
        });
      });
});
