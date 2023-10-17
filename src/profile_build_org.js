class Organization {
    constructor(txtPhotoLink,txtOrgId,txtOrgName,txtRegNumber,txtAddress,txtProvince,txtCity,txtPostalCode,txtDescription,txtWebsiteLink,service,txtFirstName,txtLastName,txtEmail,txtPhoneNumber){
        this.photoLink = txtPhotoLink;
        this.OrgId = txtOrgId;
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

const orgArray = [];
const serviceArray = [];
let flag = 0;

const form_Profile = document.getElementById("form_Profile")
form_Profile.addEventListener("submit", function (event){
    event.preventDefault();
    const txtPhotoLink = form_Profile.querySelector("#txtPhotoLink");
    const txtOrgId = form_Profile.querySelector("#txtOrgId");
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

    
    const org = new Organization(txtPhotoLink.value,txtOrgId.value,txtOrgName.value,txtRegNumber.value,txtAddress.value,txtProvince.value,txtCity.value,txtPostalCode.value,txtDescription.value,txtWebsiteLink.value,serviceArray,txtFirstName.value,txtLastName.value,txtEmail.value,txtPhoneNumber.value,);
    orgArray.push(org);
    console.log(orgArray);  
})

choose_service.addEventListener("click", function (event) {
    event.preventDefault();
    option_service.style.display = "block";
})

save_service.addEventListener("click", function (event) {
    event.preventDefault();
    const service = document.querySelectorAll("#service input");
    for ( let i of service) {
        if( i.checked === true ) {
            serviceArray.push(i.value);
        }
    }
    option_service.style.display = "none";
})
