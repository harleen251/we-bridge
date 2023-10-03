class Volunteer {
    constructor(txtVolunteerId,txtFirstName,txtLastName,txtEmail,txtPhoneNumber,txtDob,txtGender,txtUsername,txtPassword,txtAddress,txtProvince,txtCity,txtPostalCode,txtPhotoLink,txtBio,skills,experience,certificate,interest,availability){
        this.volunteerId = txtVolunteerId;
        this.firstName = txtFirstName;
        this.lastName = txtLastName;
        this.email = txtEmail;
        this.phoneNumber = txtPhoneNumber;
        this.dob = txtDob;
        this.gender = txtGender;
        this.username = txtUsername;
        this.password = txtPassword;
        this.address = txtAddress;
        this.province = txtProvince;
        this.city = txtCity;
        this.postalCode = txtPostalCode;
        this.photoLink = txtPhotoLink;
        this.bio = txtBio;
        this.skills = skills;
        this.experience = experience;
        this.certificate = certificate;
        this.interest = interest;
        this.availability = availability;
    }
}

const volunteerArray = [];
let flag = 0;

const form_SignUp = document.getElementById("signUp_Form")
form_SignUp.addEventListener("submit", function (event){
    event.preventDefault();
    const txtVolunteerId = form_SignUp.querySelector("#txtVolunteerId");
    const txtFirstName = form_SignUp.querySelector("#txtFirstName");
    const txtLastName = form_SignUp.querySelector("#txtLastName");
    const txtEmail = form_SignUp.querySelector("#txtEmail");
    const txtPhoneNumber = form_SignUp.querySelector("#txtPhoneNumber");
    const txtDob = form_SignUp.querySelector("#txtDob");
    const txtGender = form_SignUp.querySelector("#txtGender");
    const txtUsername = form_SignUp.querySelector("#txtUsername");
    const txtPassword = form_SignUp.querySelector("#txtPassword");
    const txtAddress = form_SignUp.querySelector("#txtAddress");
    const txtProvince = form_SignUp.querySelector("#txtProvince");
    const txtCity = form_SignUp.querySelector("#txtCity");
    const txtPostalCode = form_SignUp.querySelector("#txtPostalCode");
    const txtPhotoLink = form_SignUp.querySelector("#txtPhotoLink");
    const txtBio = form_SignUp.querySelector("#txtBio");

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
    if(txtPassword.value === txtConfirmPassword.value) {
        msg.innerHTML = `Passwords match`;
        flag = 1;
    } else {
        msg.innerHTML = `Passwords do not match`;
        flag = 0;
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