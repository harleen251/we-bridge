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
const org = document.querySelector('.org')
const vol = document.querySelector('.vol')
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
const linkAccount1 = document.getElementById("linkAccount1");
const orgLink = document.getElementById("orgLink");
const postLink = document.getElementById("postLink");
const appLink = document.getElementById("appLink");
const myLink = document.getElementById("myLink");
const appHisLink = document.getElementById("appHisLink");
const regLink = document.getElementById("regLink");
const volRecLink = document.getElementById("volRecLink");
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
        vol.style.display = "block";
        linkAccount1.href  = "volunteer_account.html";
        myLink.href = "volunteer_account.html"
        appHisLink.href = "volunteer_account.html#history";
        regLink.href = "volunteer_account.html#commitment";
        volRecLink.href = "volunteer_record.html"
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
                    org.style.display = "block";
                    linkAccount1.href  = "organization_account.html";
                    orgLink.href  = "organization_account.html";
                    postLink.href = "organization_account.html#post";
                    appLink.href = "organization_account.html#application";
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