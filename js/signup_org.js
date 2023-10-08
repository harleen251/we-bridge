class Organization {
    constructor(txtOrgId,txtOrgName,txtRegNumber,txtFirstName,txtLastName,txtEmail,txtPassword){
        this.OrgId = txtOrgId;
        this.orgName = txtOrgName;
        this.regNumber = txtRegNumber;
        this.firstName = txtFirstName;
        this.lastName = txtLastName;
        this.email = txtEmail;
        this.password = txtPassword;
    }
}

const orgArray = [];
let flag = 0;

const form_SignUp = document.getElementById("signUp_Form")
form_SignUp.addEventListener("submit", function (event){
    event.preventDefault();
    const txtOrgId = form_SignUp.querySelector("#txtOrgId");
    const txtOrgName = form_SignUp.querySelector("#txtOrgName");
    const txtRegNumber = form_SignUp.querySelector("#txtRegNumber");
    const txtFirstName = form_SignUp.querySelector("#txtFirstName");
    const txtLastName = form_SignUp.querySelector("#txtLastName");
    const txtEmail = form_SignUp.querySelector("#txtEmail");
    const txtPassword = form_SignUp.querySelector("#txtPassword");

    if( flag === 1) {
        const org = new Organization(txtOrgId.value,txtOrgName.value,txtRegNumber.value,txtFirstName.value,txtLastName.value,txtEmail.value,txtPassword.value);
        orgArray.push(org);
        console.log(orgArray);

        let welcome = document.getElementById("welcome");
        welcome.style.display = "block";
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
    
})