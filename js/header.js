import { getCookie, setCookie } from "./backend.js";

// Hamburger button
const hamburger = document.querySelector('.hamburger-menu');
const menu = document.querySelector('.menu');

hamburger.addEventListener('click', function() {
  // Switch .active to display/hide memu
  this.classList.toggle('active');
  menu.classList.toggle('active');
});

// login sign up dropdown
const login = document.querySelector('.login');
const signUp = document.querySelector('.signUp');
const account = document.querySelector('.account');
const submenu1 = document.querySelector('.submenu1');
const submenu2 = document.querySelector('.submenu2');
const submenu3 = document.querySelector('.submenu3');
const org1 = document.querySelector('.org1');
const vol1 = document.querySelector('.vol1');
const org2 = document.querySelector('.org2');
const vol2 = document.querySelector('.vol2');
login.addEventListener('click', function(e) {
  e.preventDefault(); 
  submenu1.classList.toggle('active');
});

signUp.addEventListener('click', function(e) {
    e.preventDefault(); 
    submenu2.classList.toggle('active');
});

account.addEventListener('click', function(e) {
    e.preventDefault(); 
    submenu3.classList.toggle('active');
});

// Retrieve the volunteerId and OrganizationId from the cookie
const dropdownBtn = document.getElementById("btnLogin");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");

const dropdownSignUp = document.getElementById("btnSignUp");
const dropdownMenuSignUp = document.getElementById("dropdownSignUp");
const toggleArrowSignUp = document.getElementById("arrowSignup");

const dropdownAcc = document.getElementById("btnAccount");
const dropdownMenuAcc = document.getElementById("dropdownAcc");
const toggleArrowAcc = document.getElementById("arrowAcc");
const orgLink1 = document.getElementById("orgLink1");
const postLink1 = document.getElementById("postLink1");
const appLink1 = document.getElementById("appLink1");
const myLink1 = document.getElementById("myLink1");
const appHisLink1 = document.getElementById("appHisLink1");
const regLink1 = document.getElementById("regLink1");
const volRecLink1 = document.getElementById("volRecLink1");
const orgLink2 = document.getElementById("orgLink2");
const postLink2 = document.getElementById("postLink2");
const appLink2 = document.getElementById("appLink2");
const myLink2 = document.getElementById("myLink2");
const appHisLink2 = document.getElementById("appHisLink2");
const regLink2 = document.getElementById("regLink2");
const volRecLink2 = document.getElementById("volRecLink2");
let volunteerId = "";
let organizationId = "";

getCookie('volunteerId')
  .then((cookieValue) => {
    if (cookieValue !== null) {
      // Cookie found, use cookieValue
      if (cookieValue !== "") {
        volunteerId = cookieValue;
        console.log(`volunteerId value: ${cookieValue}`);
        dropdownAcc.style.display = "block";
        dropdownBtn.style.display = "none";
        dropdownSignUp.style.display = "none";
        account.style.display = "block";
        login.style.display = "none";
        signUp.style.display = "none";
        vol1.style.display = "block";
        org1.style.display = "none"
        vol2.style.display = "block";
        org2.style.display = "none"
        myLink1.href = "volunteer_account.html"
        appHisLink1.href = "volunteer_account.html#history";
        regLink1.href = "volunteer_account.html#commitment";
        volRecLink1.href = "volunteer_account.html#record"
        myLink2.href = "volunteer_account.html"
        appHisLink2.href = "volunteer_account.html#history";
        regLink2.href = "volunteer_account.html#commitment";
        volRecLink2.href = "volunteer_account.html#record"
      } else {
        // Cookie not found
        getCookie('organizationId')
          .then((cookieValue) => {
              if (cookieValue !== null) {
              // Cookie found, use cookieValue
                if (cookieValue !== "") {
                    organizationId = cookieValue;
                    console.log(`organizationId value: ${cookieValue}`);
                    dropdownAcc.style.display = "block";
                    dropdownBtn.style.display = "none";
                    dropdownSignUp.style.display = "none";
                    account.style.display = "block";
                    login.style.display = "none";
                    signUp.style.display = "none";
                    vol1.style.display = "none";
                    org1.style.display = "block"
                    vol2.style.display = "none";
                    org2.style.display = "block"
                    orgLink1.href  = "organization_account.html";
                    postLink1.href = "organization_account.html#post";
                    appLink1.href = "organization_account.html#application";
                    orgLink2.href  = "organization_account.html";
                    postLink2.href = "organization_account.html#post";
                    appLink2.href = "organization_account.html#application";
                } else {
                    dropdownAcc.style.display = "none";
                    dropdownSignUp.style.display = "block";
                    dropdownBtn.style.display = "block";
                    account.style.display = "none";
                    login.style.display = "block";
                    signUp.style.display = "block";
                    console.log('organizationId not found.');
                    console.log('volunteerId not found.');
                }              
              } 
          })
          .catch((error) => {
              dropdownBtn.style.display = "block";
              dropdownSignUp.style.display = "block";
              dropdownAcc.style.display = "none";
              //console.error('An error occurred while retrieving the cookie:', error);
          });
      }      
    } 
  })
  .catch((error) => {
    //console.error('An error occurred while retrieving the cookie:', error);
  });



const toggleDropdown = function () {
    if (volunteerId !== "" || organizationId !== ""){
        dropdownMenuAcc.classList.toggle("show");
        toggleArrowAcc.classList.toggle("arrow");
    }else if (volunteerId === "" && organizationId === ""){
        dropdownMenu.classList.toggle("show");
        toggleArrow.classList.toggle("arrow");
    }   
};

const toggleDropdownSignUp = function () {
    if (volunteerId === "" && organizationId === ""){
        dropdownMenuSignUp.classList.toggle("show");
        toggleArrowSignUp.classList.toggle("arrow");
    }   
};

dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdown();
});

dropdownSignUp.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdownSignUp();
});

dropdownAcc.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdown();
});

document.documentElement.addEventListener("click", function () {
    if (dropdownMenu.classList.contains("show")) {
        toggleDropdown();
    }
    if (dropdownMenuAcc.classList.contains("show")) {
        toggleDropdown();
    }
});

async function logout() {
    // Clear cookies
    await setCookie("organizationId", "", 1);
    await setCookie("volunteerId", "", 1);
    await setCookie("vol_postId", "", 1);
    await setCookie("idPost", "", 1);
    console.log("organizationId", getCookie("organizationId"));
    console.log("volunteerId", getCookie("volunteerId"));
    window.location.href = 'index.html';
  }
const btnLogout1 = document.getElementById("btnLogout1")
const btnLogout2 = document.getElementById("btnLogout2")
btnLogout1.addEventListener('click', function (event) {
    event.preventDefault();    
    logout(); 
});

btnLogout2.addEventListener('click', function (event) {
  event.preventDefault();    
  logout(); 
});

async function handleViewButtonEvent(event) {
    let postId = event.target.getAttribute('data-postId');
    console.log(postId);
   await setCookie("vol_postId", postId, 1);
}