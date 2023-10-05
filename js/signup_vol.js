class Volunteer {
    constructor(txtVolunteerId,txtFirstName,txtLastName,txtUsername,txtEmail,txtPassword){
        this.volunteerId = txtVolunteerId;
        this.firstName = txtFirstName;
        this.lastName = txtLastName;
        this.username = txtUsername;
        this.email = txtEmail;
        this.password = txtPassword;
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
    const txtUsername = form_SignUp.querySelector("#txtUsername");
    const txtEmail = form_SignUp.querySelector("#txtEmail");
    const txtPassword = form_SignUp.querySelector("#txtPassword");

    if( flag === 1 ) {
        const volunteer = new Volunteer(txtVolunteerId.value,txtFirstName.value,txtLastName.value,txtUsername.value,txtEmail.value,txtPassword.value);
        volunteerArray.push(volunteer);
        console.log(volunteerArray);

        const pageURL = "volunteer_profile_info.html"
        window.location.href = pageURL;

       
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