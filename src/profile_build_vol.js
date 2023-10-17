class Volunteer {
    constructor(txtFirstName,txtLastName,txtPhotoLink,txtProvince,txtCity,txtPostalCode,txtAge,txtGender,txtLanguage,txtBio,txtPhoneNumber,txtEmail,skills,experience,certificate,interest,availability){
        this.firstName = txtFirstName;
        this.lastName = txtLastName;
        this.photoLink = txtPhotoLink;
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
        this.experience = experience;
        this.certificate = certificate;
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

const volunteerArray = [];
const skillArray = [];
const interestArray = [];

const form_Profile = document.getElementById("profile_Form")
saveBtn.addEventListener("click", function (event){
    event.preventDefault();
    const txtFirstName = form_Profile.querySelector("#txtFirstName");
    const txtLastName = form_Profile.querySelector("#txtLastName");
    const txtPhotoLink = form_Profile.querySelector("#txtPhotoLink");
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
    for(let k = 0; k < numberOfDivs; k++) {
        let txtJobTitle = document.getElementById(`txtJobTitle${k}`).value;
        let txtCompany = document.getElementById(`txtCompany${k}`).value;
        let txtLocation = document.getElementById(`txtLocation${k}`).value;
        let txtStartDate = document.getElementById(`txtStartDate${k}`).value;
        let txtEndDate = document.getElementById(`txtEndDate${k}`).value;
        let experience = new Experience(txtJobTitle,txtCompany,txtLocation,txtStartDate,txtEndDate);
        expArray.push(experience);
    }

    const certArray = [];
    const inputGroupCert = document.getElementById("inputGroupCert");
    const childDivsCert = inputGroupCert.querySelectorAll("div");
    const numberOfDivsCert = childDivsCert.length;
    for(let m = 0; m < numberOfDivsCert; m++) {
        let txtCertifiacteName = document.getElementById(`txtCertifiacteName${m}`).value;
        let txtIssuingOrg = document.getElementById(`txtIssuingOrg${m}`).value;
        let txtDateObtained = document.getElementById(`txtDateObtained${m}`).value;
        let certificate = new Certificate(txtCertifiacteName,txtIssuingOrg,txtDateObtained);
        certArray.push(certificate);
    }

    const availability = document.querySelectorAll("#availability input");
    const availabilityArray = [];
    for ( let i of availability) {
        if( i.checked === true ) {
            availabilityArray.push(i.value);
        }
    }
    
    const volunteer = new Volunteer(txtFirstName.value,txtLastName.value,txtPhotoLink.value,txtProvince.value,txtCity.value,txtPostalCode.value,txtAge.value,txtGender.value,txtLanguage.value,txtBio.value,txtPhoneNumber.value,txtEmail.value,skillArray,expArray,certArray,interestArray,availabilityArray);
    volunteerArray.push(volunteer);
    console.log(volunteerArray);
   
})

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