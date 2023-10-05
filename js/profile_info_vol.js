class Volunteer {
    constructor(txtPhotoLink,txtProvince,txtCity,txtPostalCode,txtAge,txtGender,txtLanguage,txtBio,txtPhoneNumber,skills,experience,certificate,interest,availability){
        this.photoLink = txtPhotoLink;
        this.province = txtProvince;
        this.city = txtCity;
        this.postalCode = txtPostalCode;
        this.age = txtAge;
        this.gender = txtGender;
        this.language = txtLanguage;
        this.bio = txtBio;
        this.phoneNumber = txtPhoneNumber;
        this.skills = skills;
        this.experience = experience;
        this.certificate = certificate;
        this.interest = interest;
        this.availability = availability;
    }
}

const volunteerArray = [];
let flag = 0;

const form_Profile = document.getElementById("profile_Form")
form_Profile.addEventListener("submit", function (event){
    event.preventDefault();
    const txtPhotoLink = form_SignUp.querySelector("#txtPhotoLink");
    const txtProvince = form_SignUp.querySelector("#txtProvince");
    const txtCity = form_SignUp.querySelector("#txtCity");
    const txtPostalCode = form_SignUp.querySelector("#txtPostalCode");
    const txtAge = form_SignUp.querySelector("#txtAge");
    const txtGender = form_SignUp.querySelector("#txtGender");
    const txtLanguage = form_SignUp.querySelector("#txtLanguage");
    const txtBio = form_SignUp.querySelector("#txtBio");
    const txtPhoneNumber = form_SignUp.querySelector("#txtPhoneNumber");

    const skill = document.querySelectorAll("#skill input");
    const skillArray = [];
    for ( let i of skill) {
        if( i.checked === true ) {
            skillArray.push(i.value);
        }
    }

    const inputExp = document.querySelectorAll("#experience_container input");
    const expArray = [];
    for ( i of inputExp) {
        if( i.value !== "" ) {
            expArray.push(i.value);
        }
    }

    const inputCert = document.querySelectorAll("#certificate_container input");
    const certArray = [];
    for ( i of inputCert) {
        if( i.value !== "" ) {
            certArray.push(i.value);
        }
    }

    const interest = document.querySelectorAll("#interest input");
    const interestArray = [];
    for ( let i of interest) {
        if( i.checked === true ) {
            interestArray.push(i.value);
        }
    }

    const availability = document.querySelectorAll("#availability input");
    const availabilityArray = [];
    for ( let i of availability) {
        if( i.checked === true ) {
            availabilityArray.push(i.value);
        }
    }
    if( flag === 1 ) {
        const volunteer = new Volunteer(txtVolunteerId.value,txtFirstName.value,txtLastName.value,txtEmail.value,txtPhoneNumber.value,txtDob.value,txtGender.value,txtUsername.value,txtPassword.value,txtAddress.value,txtProvince.value,txtCity.value,txtPostalCode.value,txtPhotoLink.value,txtBio.value,skillArray,expArray,certArray,interestArray,availabilityArray);
        volunteerArray.push(volunteer);
        console.log(volunteerArray);
    } else {
        alert("Passwords do not match. Please try again.");
    }

})


const addNewExpBtn = document.getElementById("addNewExpBtn");
addNewExpBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const inputExp = document.createElement("input");
    inputExp.type = "text";
    (document.getElementById("expInputGroup")).append(inputExp);
})

const addNewCertBtn = document.getElementById("addNewCertBtn");
addNewCertBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const inputCert = document.createElement("input");
    inputCert.type = "text";
    (document.getElementById("certInputGroup")).append(inputCert);
})