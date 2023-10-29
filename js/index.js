import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

const firebassApp = initializeApp({
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
});

  // Function to get the value of a cookie by its name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Reference to Firestore
const db = getFirestore(firebassApp);

// Reference to the post collection
const postCollection = collection(db, "posts");

// Retrieve the users' ID from the cookie
const volunteerId = getCookie("volunteerId");
const organizationId = getCookie("organizationId");
console.log("volunteerId :"+volunteerId);
console.log("organizationId :"+organizationId);


if (volunteerId != null) {
    console.log("Volunteer Logged In!");
}

const dropdownBtn = document.getElementById("btnLogin");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");
// const volunteerBtn = document.getElementById("btnVol");
// const organizationBtn = document.getElementById("btnOrg");

const toggleDropdown = function () {
    dropdownMenu.classList.toggle("show");
    toggleArrow.classList.toggle("arrow");
};

dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdown();
});

document.documentElement.addEventListener("click", function () {
    if (dropdownMenu.classList.contains("show")) {
        toggleDropdown();
    }
});


const q = query(postCollection, orderBy('date', 'desc'), limit(3));
let i = 1;

getDocs(q)
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    const post = doc.data();
    let txtInner = `<header><h1>${post.positionTitle}</h1></header>`
    let txt2Inner = `<header><h1>${post.positionTitle}</h1></header>`

    console.log(i);
    i++;
    console.log(txtInner);
    console.log(post.description);
    console.log(post.date);
    let cardDiv = document.createElement("div"); // create new Div, cardDiv to display details data             
    cardDiv.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......
    txtInner += `<p>${doc.id}</p>`;
    txtInner += `<p>${post.date.toDate().toLocaleString()}</p>`;
    //txtInner += `<p>${post.date}</p>`;
    txtInner += `<p>${post.description}</p>`; // add the title             
    cardDiv.innerHTML = txtInner;
    containerOpp.appendChild(cardDiv); // add cardDiv to orderDiv

    let card2Div = document.createElement("div"); // create new Div, cardDiv to display details data             
    card2Div.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......
    txt2Inner += `<a href="">${doc.id}</p>`;
    txt2Inner += `<p>${post.date.toDate().toLocaleString()}</p>`;
    txt2Inner += `<p>${post.description}</p>`; // add the title             
    card2Div.innerHTML = txt2Inner;
    containerRec.appendChild(card2Div); // add cardDiv to orderDiv
    });
})
.catch((error) => {
    console.error('Error fetching latest post:', error);
});
  
