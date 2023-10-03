class Organization {
    constructor(txtOrgId,txtOrgName,txtEmail,txtPhoneNumber,txtUsername,txtPassword,txtAddress,txtProvince,txtCity,txtPostalCode,txtPhotoLink,txtDescription,txtRegNumber,category,txtWebsiteLink){
        this.OrgId = txtOrgId;
        this.orgName = txtOrgName;
        this.email = txtEmail;
        this.phoneNumber = txtPhoneNumber;
        this.username = txtUsername;
        this.password = txtPassword;
        this.address = txtAddress;
        this.province = txtProvince;
        this.city = txtCity;
        this.postalCode = txtPostalCode;
        this.photoLink = txtPhotoLink;
        this.description = txtDescription;
        this.regNumber = txtRegNumber;
        this.category = category;
        this.websiteLink = txtWebsiteLink;
    }
}

const orgArray = [];
let flag = 0;

const form_SignUp = document.getElementById("signUp_Form")
form_SignUp.addEventListener("submit", function (event){
    event.preventDefault();
    const txtOrgId = form_SignUp.querySelector("#txtOrgId");
    const txtOrgName = form_SignUp.querySelector("#txtOrgName");
    const txtEmail = form_SignUp.querySelector("#txtEmail");
    const txtPhoneNumber = form_SignUp.querySelector("#txtPhoneNumber");
    const txtUsername = form_SignUp.querySelector("#txtUsername");
    const txtPassword = form_SignUp.querySelector("#txtPassword");
    const txtAddress = form_SignUp.querySelector("#txtAddress");
    const txtProvince = form_SignUp.querySelector("#txtProvince");
    const txtCity = form_SignUp.querySelector("#txtCity");
    const txtPostalCode = form_SignUp.querySelector("#txtPostalCode");
    const txtPhotoLink = form_SignUp.querySelector("#txtPhotoLink");
    const txtDescription = form_SignUp.querySelector("#txtDescription");
    const txtRegNumber = form_SignUp.querySelector("#txtRegNumber");
    const inputCatg = document.querySelectorAll("#category_container input");
    const catgArray = [];
    for ( i of inputCatg) {
        if( i.value !== "" ) {
            catgArray.push(i.value);
        }
    }
    const txtWebsiteLink = form_SignUp.querySelector("#txtWebsiteLink");

    if( flag === 1) {
        const org = new Organization(txtOrgId.value,txtOrgName.value,txtEmail.value,txtPhoneNumber.value,txtUsername.value,txtPassword.value,txtAddress.value,txtProvince.value,txtCity.value,txtPostalCode.value,txtPhotoLink.value,txtDescription.value,txtRegNumber.value,catgArray,txtWebsiteLink.value);
        orgArray.push(org);
        // console.log(orgArray);
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

const addNewCatgBtn = document.getElementById("addNewCatgBtn");
addNewCatgBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const inputCatg = document.createElement("input");
    inputCatg.type = "text";
    (document.getElementById("catgInputGroup")).append(inputCatg);
})
