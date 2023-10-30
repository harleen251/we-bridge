
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, setDoc } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
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
  const volunteerCollection = collection(db, "volunteer");
  
  // Retrieve the user's ID from the cookie
  const volunteerId = getCookie("volunteerId");
  
  
  
  async function getVolunteerInfo(){
      const docRef = doc(volunteerCollection, volunteerId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
          const volunteerData = docSnap.data();
          console.log("Document data:", volunteerData);
          document.getElementById('txtFirstName').value = volunteerData.firstName;
          document.getElementById('txtLastName').value = volunteerData.lastName;
          document.getElementById('txtEmail').value = volunteerData.email;
          document.getElementById('profilePic').src = volunteerData.photoLink;
          document.getElementById('txtBio').value = volunteerData.bio;
          document.getElementById('txtCity').value = volunteerData.city;
          document.getElementById('txtProvince').value = volunteerData.province;
          document.getElementById('txtPostalCode').value = volunteerData.postalCode;
          document.getElementById('txtPhoneNumber').value = volunteerData.phoneNumber;

          let age = volunteerData.age;
          const selectAge = document.getElementById("txtAge");
          for (const option of selectAge.options) {
            if (option.value === age) {
                option.selected = true;
                break; // Exit the loop once the option is found
            }
          } 
          
          let gender = volunteerData.gender;
          const selectGender = document.getElementById("txtGender");
          for (const option of selectGender.options) {
            if (option.value === gender) {
                option.selected = true;
                break; // Exit the loop once the option is found
            }
          } 

          let interest = volunteerData.interest;
          interest.forEach(element => {
              const checkbox = document.querySelector(`input[value="${element}"]`);
              if (checkbox) {
                  checkbox.checked = true;
              }
          });

          let availability = volunteerData.availability;
          availability.forEach(element => {
              console.log(element);
              const checkbox = document.querySelector(`input[value="${element}"]`);
              if (checkbox) {
                  checkbox.checked = true;
              }
          });

          let skills = volunteerData.skills;
          skills.forEach(element => {
              const checkbox = document.querySelector(`input[value="${element}"]`);
              if (checkbox) {
                  checkbox.checked = true;
              }
          });

          let language = volunteerData.language;
          const selectLanguage = document.getElementById("txtLanguage");
          for (const option of selectLanguage.options) {
            if (option.value === language) {
                option.selected = true;
                break; // Exit the loop once the option is found
            }
          } 
          
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }
  
  // Call the function when the window loads
  window.onload = getVolunteerInfo();
  
class Volunteer {
constructor(txtFirstName,txtLastName,txtProvince,txtCity,txtPostalCode,txtAge,txtGender,txtLanguage,txtBio,txtPhoneNumber,txtEmail,skills,interest,availability){
    this.firstName = txtFirstName;
    this.lastName = txtLastName;
    this.province = txtProvince;
    this.city = txtCity;
    this.postalCode = txtPostalCode;
    this.age = txtAge;
    this.gender = txtGender;
    this.language = txtLanguage;
    this.bio = txtBio;
    this.phoneNumber = txtPhoneNumber;
    this.email = txtEmail;
    this.skills = skills;
    this.interest = interest;
    this.availability = availability;
}
}

class Experience {
    constructor(txtJobTitle,txtCompany,txtLocation,txtStartDate,txtEndDate){
        this.jobTitle = txtJobTitle;
        this.company = txtCompany;
        this.location = txtLocation;
        this.startDate = txtStartDate;
        this.endDate = txtEndDate;
    }
}

class Certificate {
    constructor(txtCertifiacteName,txtIssuingOrg,txtDateObtained){
        this.certificateName = txtCertifiacteName;
        this.issuingOrg = txtIssuingOrg;
        this.dateObtained = txtDateObtained;
    }
}

// Firestore data converter
const experienceConverter = {
    toFirestore: function(experience) {
        return {
            jobTitle: experience.jobTitle,
            company: experience.company,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.endDate
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Experience(
            data.jobTitle,
            data.company,
            data.location,
            data.startDate,
            data.endDate
        );
    }
};

const certificateConverter = {
    toFirestore: function(certificate) {
        return {
            certificateName: certificate.certificateName,
            issuingOrg: certificate.issuingOrg,
            dateObtained: certificate.dateObtained
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Certificate(
            data.certificateName,
            data.issuingOrg,
            data.dateObtained
        );
    }
};

const volunteerConverter = {
    toFirestore: function(volunteer) {
        return {
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            province: volunteer.province,
            city: volunteer.city,
            postalCode: volunteer.postalCode,
            age: volunteer.age,
            gender: volunteer.gender,
            language: volunteer.language,
            bio: volunteer.bio,
            phoneNumber: volunteer.phoneNumber,
            email: volunteer.email,
            skills: volunteer.skills,
            interest: volunteer.interest,
            availability: volunteer.availability
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Volunteer(
            data.firstName,
            data.lastName,
            data.photoLink,
            data.province,
            data.city,
            data.postalCode,
            data.age,
            data.gender,
            data.language,
            data.bio,
            data.phoneNumber,
            data.email,
            data.skills,
            data.interest,
            data.availability
        );
    }
};



const volunteerArray = [];
const skillArray = [];
const interestArray = [];

const form_Profile = document.getElementById("profile_Form")
document.getElementById("saveBtn").addEventListener("click", function (event){
    event.preventDefault();
    try {
        saveVolunteer();   
    } catch (error) {
        
    }    
});

async function saveVolunteer(){
    const prevUrl = document.referrer; // previous page link
    let redirectURL = "index.html"

    if (prevUrl !== ""){
        redirectURL = document.referrer;
    }

    const txtFirstName = form_Profile.querySelector("#txtFirstName");
    const txtLastName = form_Profile.querySelector("#txtLastName");
    const txtProvince = form_Profile.querySelector("#txtProvince");
    const txtCity = form_Profile.querySelector("#txtCity");
    const txtPostalCode = form_Profile.querySelector("#txtPostalCode");
    const txtAge = form_Profile.querySelector("#txtAge");
    const txtGender = form_Profile.querySelector("#txtGender");
    const txtLanguage = form_Profile.querySelector("#txtLanguage");
    const txtBio = form_Profile.querySelector("#txtBio");
    const txtPhoneNumber = form_Profile.querySelector("#txtPhoneNumber");
    const txtEmail = form_Profile.querySelector("#txtEmail");
    
    const expArray = [];
    const inputGroup = document.getElementById("inputGroup");
    const childDivs = inputGroup.querySelectorAll("div");
    const numberOfDivs = childDivs.length;
    const expData = {experience : []};
    for(let k = 0; k < numberOfDivs; k++) {
        let txtJobTitle = document.getElementById(`txtJobTitle${k}`).value;
        let txtCompany = document.getElementById(`txtCompany${k}`).value;
        let txtLocation = document.getElementById(`txtLocation${k}`).value;
        let txtStartDate = document.getElementById(`txtStartDate${k}`).value;
        let txtEndDate = document.getElementById(`txtEndDate${k}`).value;
        let experience = new Experience(txtJobTitle,txtCompany,txtLocation,txtStartDate,txtEndDate);
        expArray.push(experience);
        expData.experience.push(
            {
                jobTitle: experience.jobTitle,
                company: experience.company,
                location: experience.location,
                startDate: experience.startDate,
                endDate: experience.endDate
            }
        );
    }
    const expRef = doc(volunteerCollection, volunteerId);
    await setDoc(expRef, expData, { merge: true }).then(() => {
        console.log('Experience data saved successfully.');
    })
    .catch((error) => {
        console.error('Error saving Experience data: ', error);
    });
    const certArray = [];
    const inputGroupCert = document.getElementById("inputGroupCert");
    const childDivsCert = inputGroupCert.querySelectorAll("div");
    const numberOfDivsCert = childDivsCert.length;
    const certData = {certificate : []};
    for(let m = 0; m < numberOfDivsCert; m++) {
        let txtCertifiacteName = document.getElementById(`txtCertifiacteName${m}`).value;
        let txtIssuingOrg = document.getElementById(`txtIssuingOrg${m}`).value;
        let txtDateObtained = document.getElementById(`txtDateObtained${m}`).value;
        let certificate = new Certificate(txtCertifiacteName,txtIssuingOrg,txtDateObtained);
        certArray.push(certificate);
        certData.certificate.push(
            {
                certificateName: certificate.certificateName,
                issuingOrg: certificate.issuingOrg,
                dateObtained: certificate.dateObtained
            }
        );
    }
    // const certificateRef = doc(volunteerCollection, volunteerId).withConverter(certificateConverter);
    const certificateRef = doc(volunteerCollection, volunteerId)
    await setDoc(certificateRef, certData , { merge: true }).then(() => {
        console.log('Certificate data saved successfully.');
    })
    .catch((error) => {
        console.error('Error saving Certificate data: ', error);
    });

    const availability = document.querySelectorAll("#availability input");
    const availabilityArray = [];
    for ( let i of availability) {
        if( i.checked === true ) {
            availabilityArray.push(i.value);
        }
    }
    
    const volunteer = new Volunteer(txtFirstName.value,txtLastName.value,txtProvince.value,txtCity.value,txtPostalCode.value,txtAge.value,txtGender.value,txtLanguage.value,txtBio.value,txtPhoneNumber.value,txtEmail.value,skillArray,interestArray,availabilityArray);
    
    const docRef = doc(volunteerCollection, volunteerId).withConverter(volunteerConverter);
    await setDoc(docRef, volunteer, { merge: true }).then(() => {
        console.log('Volunteer data saved successfully.');
        alert(redirectURL);
        window.location.href = redirectURL;
    })
    .catch((error) => {
        console.error('Error saving volunteer data: ', error);
    });
}

let j = 0;
const addNewExpBtn = document.getElementById("addNewExpBtn");
addNewExpBtn.addEventListener("click", function (event) {
    event.preventDefault();
    j += 1;
    const div = document.createElement("div");
    div.setAttribute("id", `expInputGroup${j}`);
    div.innerHTML = `
    <label for="txtJobTitle${j}">Job Title</label>
    <input type="text" id="txtJobTitle${j}">
    <label for="txtCompany${j}">Company Name</label>
    <input type="text" id="txtCompany${j}">
    <label for="txtLocation${j}">Location</label>
    <input type="text" id="txtLocation${j}">
    <label for="txtStartDate${j}">Start Date</label>
    <input type="date" id="txtStartDate${j}">
    <label for="txtEndDate${j}">End Date</label>
    <input type="date" id="txtEndDate${j}">
    `;
    (document.getElementById(`inputGroup`)).append(div);
})

let l = 0;
const addNewCertBtn = document.getElementById("addNewCertBtn");
addNewCertBtn.addEventListener("click", function (event) {
    event.preventDefault();
    l += 1;
    const div = document.createElement("div");
    div.setAttribute("id", `certInputGroup${l}`);
    div.innerHTML = `
    <label for="txtCertifiacteName${l}">Certificate Name</label>
    <input type="text" id="txtCertifiacteName${l}">
    <label for="txtIssuingOrg${l}">Issuing Organization</label>
    <input type="text" id="txtIssuingOrg${l}">
    <label for="txtDateObtained${l}">Date Obtained</label>
    <input type="date" id="txtDateObtained${l}">
    `;
    (document.getElementById(`inputGroupCert`)).append(div);
})

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
    option_skill.style.display = "none";
})

next_Info.addEventListener("click", function (event) {
    event.preventDefault();
    preference_background.style.display = "block";
    personal_Info.style.display = "none";
})

edit_preference_background.addEventListener("click" ,function (event) {
    event.preventDefault();
    preference_background.style.display = "block";
    personal_Info.style.display = "none";
})

edit_personal_Info.addEventListener("click" ,function (event) {
    event.preventDefault();
    preference_background.style.display = "none";
    personal_Info.style.display = "block";
})

const fileInput = document.getElementById("txtPhotoLink");
const uploadButton = document.getElementById("uploadButton");

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const fileName = file.name;

    const imageRef = ref(storage, "profile-pictures/volunteer/" + fileName);

    // uploadButton.disabled = true; // Disable the button during upload

    uploadBytes(imageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(imageRef).then((downloadURL) => {
            profilePic.src = downloadURL;
            const expRef = doc(volunteerCollection, volunteerId);
            setDoc(expRef, {photoLink : downloadURL}, { merge: true }).then(() => {
                console.log('PhotoLink data saved successfully.');
            })
            .catch((error) => {
                console.error('Error saving PhotoLink data: ', error);
            });
            // uploadButton.disabled = false; // Re-enable the button after successful upload
        });
      });

    // uploadTask.on("state_changed",
    //     (snapshot) => {
    //         // Handle progress (if needed)
    //     },
    //     (error) => {
    //         console.error(error);
    //         uploadButton.disabled = false; // Re-enable the button in case of an error
    //     },
    //     () => {
    //         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //             profilePic.src = downloadURL;
    //             uploadButton.disabled = false; // Re-enable the button after successful upload
    //         });
    //     }
    // );
});