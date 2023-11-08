import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, query, orderBy, limit, getDocs, where, Timestamp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { getCookie, setCookie } from "./backend.js";

const firebassApp = initializeApp({
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
});

// Reference to Firestore
const db = getFirestore(firebassApp);

// Reference to the post collection
const postCollection = collection(db, "posts");
const volunteerCollection = collection(db, "volunteer");

// Retrieve the volunteerId and OrganizationId from the cookie
let volunteerId = "";
let organizationId = "";

getCookie('volunteerId')
  .then((cookieValue) => {
    if (cookieValue !== null) {
      // Cookie found, use cookieValue
      if (cookieValue !== "") {
        volunteerId = cookieValue;
        console.log(`volunteerId value: ${cookieValue}`);
        btnAccount.style.display = "block";
        btnLogin.style.display = "none";
        btnSignUp.style.display = "none";
        linkAccount.href  = "volunteer_account.html";
      } else {
        // Cookie not found
        getCookie('IdOrganization')
          .then((cookieValue) => {
              if (cookieValue !== null) {
              // Cookie found, use cookieValue
                if (cookieValue !== "") {
                    organizationId = cookieValue;
                    console.log(`organizationId value: ${cookieValue}`);
                    btnAccount.style.display = "block";
                    btnLogin.style.display = "none";
                    btnSignUp.style.display = "none";
                    linkAccount.href  = "organization_account.html";
                   
                } else {
                    btnAccount.style.display = "none";
                    btnSignUp.style.display = "block";
                    btnLogin.style.display = "block";
                    console.log('organizationId not found.');
                    console.log('volunteerId not found.');
                }              
              } 
          })
          .catch((error) => {
              btnLogin.style.display = "block";
              btnSignUp.style.display = "block";
              btnAccount.style.display = "none";
              //console.error('An error occurred while retrieving the cookie:', error);
          });
      }      
    } 
  })
  .catch((error) => {
    //console.error('An error occurred while retrieving the cookie:', error);
  });


const dropdownBtn = document.getElementById("btnLogin");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");

const dropdownSignUp = document.getElementById("btnSignUp");
const dropdownMenuSignUp = document.getElementById("dropdownSignUp");
const toggleArrowSignUp = document.getElementById("arrowSignup");

const dropdownAcc = document.getElementById("btnAccount");
const dropdownMenuAcc = document.getElementById("dropdownAcc");
const toggleArrowAcc = document.getElementById("arrowAcc");

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

const today = Timestamp.now();
// const expireDate = Timestamp.fromDate(today);

const q = query(postCollection,
    where('expireDate', '>', today),
    orderBy('expireDate','desc'),
    orderBy('date','desc'),
    limit(5));
let i = 1;

await getDocs(q)
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    const post = doc.data();
    // let txtInner = `<header><h1>${post.positionTitle}</h1></header>`;    
    let txtInner = ""; 
    console.log(i);
    i++;
    let cardDiv = document.createElement("div"); // create new Div, cardDiv to display details data             
    cardDiv.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......
    
    const anchor = document.createElement('a');
    anchor.href = 'post_detail.html';
    anchor.innerText = post.positionTitle;
    anchor.setAttribute("data-postId", doc.id);            
    anchor.addEventListener('click', handleViewButtonEvent);
    txtInner += `<p>${post.description}</p>`; // add the title   
    txtInner += `<p>${post.date.toDate().toLocaleDateString()}</p>`;
    txtInner += `<p>${"Exp : " + post.expireDate.toDate().toLocaleDateString()}</p>`;              
    cardDiv.innerHTML = txtInner;
    cardDiv.prepend(anchor);   
    containerOpp.appendChild(cardDiv); // add cardDiv to orderDiv   
    });
})
.catch((error) => {
    console.error('Error fetching latest post:', error);
});

async function getVolunteerInfo(volunteerId){
    const docRef = doc(volunteerCollection, volunteerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const volunteerData = docSnap.data();
        console.log("Document data:", volunteerData);
        let q = query(postCollection, where('expireDate', '>', today), orderBy('expireDate','desc'), orderBy('date', 'desc'), limit(3)); 
        let interestArr = [];
        console.log("Vol Interest Arr : ", volunteerData.interest.length);
        if ( volunteerData.interest.length > 0 ){
            volunteerData.interest.forEach(element => {
                interestArr.push(element);
            });
            console.log(interestArr);
            q = query(postCollection,
                     where("interests", "array-contains-any", interestArr), 
                     where('expireDate', '>', today),
                     orderBy('expireDate','desc'),
                     orderBy('date', 'desc'));       
        }        

        await getDocs(q)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            const post = doc.data();  
            let card2Div = document.createElement("div"); // create new Div, cardDiv to display details data             
            card2Div.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......     
            document.getElementById("h1Recomm").style.display = "block";  
            // let txt2Inner = `<h1>${post.positionTitle}</h1>`; 
            let txt2Inner = ""; 
            const anchor = document.createElement('a');
            anchor.href = 'post_detail.html';
            anchor.innerText = post.positionTitle;
            anchor.setAttribute("data-postId", doc.id);            
            anchor.addEventListener('click', handleViewButtonEvent);
            txt2Inner += `<p>${post.description}</p>`; // add the title  
            txt2Inner += `<p>${"Event Date :" + post.date.toDate().toLocaleDateString()}</p>`;
            txt2Inner += `<p>${"Location : " + post.location}</p>`;                       
            card2Div.innerHTML = txt2Inner;         
            card2Div.prepend(anchor);   
            containerRec.appendChild(card2Div); // add cardDiv to orderDiv
            });
        })
        .catch((error) => {
            console.error('Error fetching latest post:', error);
        });
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

//Recommanded Opportunities
if (volunteerId !== "") {
    console.log("Volunteer Logged In!");
    getVolunteerInfo(volunteerId);  
}else {
    console.log("Volunteer Info Null");
}

//LogOut

async function logout() {
    // Clear cookies
    await setCookie("organizationId", "", 1);
    await setCookie("volunteerId", "", 1);
    console.log("organizationId", getCookie("organizationId"));
    console.log("volunteerId", getCookie("volunteerId"));
    window.location.href = 'index.html';
  }

btnLogout.addEventListener('click', function (event) {
    event.preventDefault();    
    logout(); 
});

async function handleViewButtonEvent(event) {
    let postId = event.target.getAttribute('data-postId');
    console.log(postId);
   await setCookie("vol_postId", postId, 1);
}
  
