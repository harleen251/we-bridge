import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js';
import { getCookie, setCookie} from "./backend.js"

// includeHTML();

const firebassApp = initializeApp({
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
  });

const storage = getStorage();

// Reference to Firestore
const db = getFirestore(firebassApp);

// Reference to the volunteer collection
const volunteerCollection = collection(db, "volunteer");
const organizationCollection = collection(db, "organization"); //organizationId

// Retrieve the user's ID from the cookie
const volunteerId = await getCookie("volunteerId");

const btnHistory = document.getElementById("btnHistory");
const btnEvent = document.getElementById("btnEvent");
const btnRecord = document.getElementById("btnRecord");

console.log(volunteerId);

async function getVolunteerInfo(){
    const docRef = doc(volunteerCollection, volunteerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const volunteerData = docSnap.data();
        console.log("Document data:", volunteerData);
        document.getElementById("welcome_tag").innerHTML = `Welcome ${volunteerData.firstName}!`;
            let profile_info = document.getElementById("profile_info")
            profile_info.innerHTML = `  <div>
                                        <img class="profile_pic" src= "${(volunteerData.photoLink == null ? " " : volunteerData.photoLink)}" alt = "profile image">
                                        </div>
                                        <div>
                                        <h2>${volunteerData.firstName + " " + volunteerData.lastName}</h2> 
                                        <p>${(volunteerData.city == null ? " " : volunteerData.city)}, ${(volunteerData.province == null ? " " : volunteerData.province)}</p>
                                        <p id="vol_description">${(volunteerData.bio == null ? " " : volunteerData.bio)}</p>
                                        <div id="skillList_vol"></div>
                                        </div>`;
                                        for(let i = 0; i < volunteerData.skills.length; i++) {
                                            let p = document.createElement("p");
                                            p.innerHTML = volunteerData.skills[i];
                                            skillList_vol.appendChild(p);
                                        }
        getApplicantInfo();
        
    } else {
        console.log("No such document!");
    }
}

async function getApplicantInfo() {
    containerRec.innerHTML = "";
    const applicationCollection = collection( db, 'application' );
    let q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ));
    let applicationFilter = document.getElementById("applicationFilter").value;
    console.log(applicationFilter);
    if((applicationFilter === "applied")) {
        q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ), where("status", "==", "applied"));
    } else if((applicationFilter === "approved")) {
        q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ), where("status", "in", ["complete", "approved"]));
    } else if((applicationFilter === "declined")) {
        q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ), where("status", "==", "declined"));
    }
    await getDocs(q, applicationCollection)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {                    
                    
                    querySnapshot.forEach((appDoc) => {
                        const application = appDoc.data();                   
                        console.log("application.postsID : "+  application.postsID);
                        const postsCollection = collection( db, 'posts' ); 
                        const postRef = doc(postsCollection, application.postsID);
                        getDoc(postRef)
                            .then((postDoc) => {
                                if (postDoc.exists) {
                                const postData = postDoc.data();
                                console.log('Post Details : ', postData);
                                let txt2Inner = '';
                                switch (application.status) {
                                    case "approved":
                                        txt2Inner +=`<p><img class="card_icons" src="../images/icons/approved.svg">  ${application.status}</p>` ;
                                        break;
                                    case "complete":
                                        txt2Inner +=`<p><img class="card_icons" src="../images/icons/approved.svg">  ${application.status}</p>` ;
                                    break;
                                    case "declined":
                                        txt2Inner +=`<p><img class="card_icons" src="../images/icons/declined.svg">  ${application.status}</p>` ;
                                        break;
                                    case "applied":
                                        txt2Inner +=`<p><img class="card_icons" src="../images/icons/pending.svg">  ${application.status}</p>` ;
                                        break;
                                    default:
                                        break;
                                }
                                    
                                txt2Inner += `<header><h3>${postData.positionTitle}</h3></header>`;
                                // document.getElementById("h1Application").style.display = "block";  
                                let card2Div = document.createElement("div"); 
                                card2Div.setAttribute("class", "card"); 
                                // txt2Inner += `<a href="">${postDoc.id}</p>`;
                                // txt2Inner += `<p>${postData.positionTitle}</p>`;
                                txt2Inner +=`<div id="card_date_container"><img class="card_icons" src="../images/icons/date.svg"><p class="post_date">${application.dateApplied.toDate().toLocaleString()}</p></div>` ;
                                txt2Inner += `<div id="card_location_container"><img class="card_icons" src="../images/icons/location.svg"><p class="post_location">${postData.location}</p></div>`; 
                                // txt2Inner += `<p>${postData.location}</p>`;
                                // txt2Inner += `<p>${application.dateApplied.toDate().toLocaleString()}</p>`;                                        
                                card2Div.innerHTML = txt2Inner;
                                containerRec.appendChild(card2Div); // add cardDiv to orderDiv
                                const viewButton = document.createElement('button');
                                viewButton.setAttribute("class", "viewButton");
                                viewButton.setAttribute("data-appId", appDoc.id);
                                viewButton.setAttribute("data-postId", application.postsID);
                                viewButton.innerHTML = 'Check Details';
                                let buttonDiv = document.createElement("div");
                                buttonDiv.setAttribute("class", "btnDiv");
                                buttonDiv.append(viewButton);
                                card2Div.append(buttonDiv);
                                console.log("button appened");
                                viewButton.addEventListener('click', handleViewButtonEvent); 
                                } else {
                                console.log('Post with postId not found.');
                                }})
                            .catch((error) => {
                                console.error('Error fetching post details:', error);
                            });
                    });                    
                }                
            })
            .catch((error) => {
                console.error('Error fetching application data:', error);
            });
    getRegisteredInfo();       
}

async function getRegisteredInfo() {
    containerRegistered.innerHTML = "";
    const applicationCollection = collection( db, 'application' );
    let q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ), where("status",  "in", ["approved", "complete"]));
    let applicationFilter = document.getElementById("applicationFilter2").value;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison.
    console.log(applicationFilter);
    if((applicationFilter === "active")) {
        q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ), where("status", "==", "approved"));
    } else if((applicationFilter === "closed")) {
        q = query(applicationCollection, where( "volunteerID", "==" , volunteerId ), where("status", "==", "complete"));
    } 
    await getDocs(q, applicationCollection)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {  
                                 
                    querySnapshot.forEach((appDoc) => {
                        let buttonDiv = document.createElement("div");
                        buttonDiv.setAttribute("class", "btnDiv2");
                        const application = appDoc.data(); 
                        let orgName = '';
                        console.log('application.organizationId : ' + application.organizationId)  
                        const orgRef = doc(organizationCollection, application.organizationId);
                        getDoc(orgRef)
                            .then((orgsnapshot) => {
                                let organizationdata = orgsnapshot.data();
                                console.log("Organization data:", organizationdata.orgName);
                                orgName = organizationdata.orgName;            
                        })
                        .catch((error) => {
                                console.error("Error getting document:", error);
                        });       
                        console.log("application.postsID : "+  application.postsID);
                        const postsCollection = collection( db, 'posts' ); 
                        const postRef = doc(postsCollection, application.postsID);
                        getDoc(postRef) 
                            .then((postDoc) => {
                                if (postDoc.exists) {
                                    const postData = postDoc.data();
                                    console.log('Post Details : ', postData);
                                    let txt2Inner = `<header><h3>${postData.positionTitle}</h3></header>`;
                                    // document.getElementById("h1Recomm").style.display = "block";  
                                    let card2Div = document.createElement("div"); // create new Div, cardDiv to display details data                                           
                                    card2Div.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......
                                    // txt2Inner += `<a href="">${appDoc.id}</p>`;
                                    // txt2Inner += `<a href="">${postData.positionTitle}</p>`;
                                    txt2Inner += `<h5>${orgName}</h5>`;
                                    txt2Inner +=`<div id="card_date_container"><img class="card_icons" src="../images/icons/date.svg"><p class="post_date">${application.dateApplied.toDate().toLocaleString()}</p></div>` ;
                                    txt2Inner += `<div id="card_location_container"><img class="card_icons" src="../images/icons/location.svg"><p class="post_location">${postData.location}</p></div>`; 
                                    // txt2Inner += `<p>${application.status}</p>`; // add the title             
                                    card2Div.innerHTML = txt2Inner;
                                    containerRegistered.appendChild(card2Div); // add cardDiv to orderDiv
                                    if (application.status === "approved" && postData.date < currentDate) {
                                        const volRecordCollection = collection( db, 'volunteerRecord' );
                                        let volRecordQ = query(volRecordCollection, where( "volunteerID", "==" , volunteerId ), where("postsID",  "==", postDoc.id));
                                        getDocs(volRecordQ, volRecordCollection)
                                            .then((volRecordQSnapshot) => {
                                                if (!volRecordQSnapshot.empty) {  
                                                    volRecordQSnapshot.forEach((volRecordDoc) => {
                                                        const volRecord = volRecordDoc.data(); 
                                                        if(volRecord.checkOutDate == null){
                                                            console.log("checkInDate" , volRecord.checkInDate);
                                                            console.log("checkOutDate" , volRecord.checkOutDate);
                                                            const checkInButton = document.createElement('button');
                                                            checkInButton.setAttribute("class", "checkInButton");
                                                            checkInButton.setAttribute("data-appId", appDoc.id);
                                                            checkInButton.setAttribute("data-postId", application.postsID);
                                                            console.log("app ID : " + appDoc.id);
                                                            checkInButton.setAttribute("class", "viewButton");
                                                            checkInButton.setAttribute("checkedIn", "false");
                                                            checkInButton.innerHTML = 'Check Out';     
                                                            buttonDiv.append(checkInButton);
                                                            card2Div.append(buttonDiv);
                                                            console.log("button checkOutButton appened");
                                                            checkInButton.addEventListener('click', handleCheckInButtonEvent);
                                                        }                                                        
                                                    })                                                    
                                                 }else{                                                    
                                                    const checkInButton = document.createElement('button');
                                                    checkInButton.setAttribute("class", "checkInButton");
                                                    checkInButton.setAttribute("data-appId", appDoc.id);
                                                    checkInButton.setAttribute("data-postId", application.postsID);
                                                    console.log("posts ID :   " + application.postsID);
                                                    checkInButton.setAttribute("class", "viewButton");
                                                    checkInButton.setAttribute("checkedIn", "true");
                                                    checkInButton.innerHTML = 'Check In';                                                    
                                                    buttonDiv.append(checkInButton);
                                                    card2Div.append(buttonDiv);
                                                    console.log("button checkInButton appened");
                                                    checkInButton.addEventListener('click', handleCheckInButtonEvent);                                                    
                                                 }
                                            })
                                            .catch((error) => {
                                                console.error('Error fetching application data:', error);
                                            });  
                                    }
                                    const viewButton = document.createElement('button');
                                    viewButton.setAttribute("class", "viewButton");
                                    viewButton.setAttribute("data-appId", appDoc.id);
                                    viewButton.setAttribute("data-postId", application.postsID);
                                    viewButton.innerHTML = 'Check Details';
                                    buttonDiv.append(viewButton);
                                    card2Div.append(buttonDiv);
                                    console.log("button appened");
                                    viewButton.addEventListener('click', handleViewButtonEvent); 
                                } else {
                                    console.log('Post with postId not found.');
                                }
                            })
                            .catch((error) => {
                                console.error('Error fetching post details:', error);
                            });
                    });                    
                }                
            })
            .catch((error) => {
                console.error('Error fetching application data:', error);
            });            
}
  
window.onload = async function () {
    await getVolunteerInfo(); // Add await here to ensure data is fetched
};

document.getElementById("btnEditProfile").addEventListener("click", async function (event) {
    event.preventDefault();
    const pageURL = "volunteer_build_profile.html";
    window.location.href = pageURL;
});



async function handleViewButtonEvent(event) {
    let appId = event.target.getAttribute('data-appId');
    let postId = event.target.getAttribute('data-postId');
    console.log(appId);
    console.log(postId);
   await setCookie("vol_applicationId", appId, 1);
   await setCookie("vol_postId", postId, 1);
   window.location.href = 'post_detail.html';
}

async function handleCheckInButtonEvent(event) {
    let appId = event.target.getAttribute('data-appId');
    let postId = event.target.getAttribute('data-postId');
    let checkIn = event.target.getAttribute('checkedIn');
    console.log(appId);
    console.log(postId);
   await setCookie("vol_applicationId", appId, 1);
   await setCookie("vol_postId", postId, 1);
   await setCookie("checkedIn", checkIn , 1);
   window.location.href = 'camera_page.html';
}

applicationFilter.addEventListener("change", async function(event) {
    event.preventDefault();    
    try {
        await getApplicantInfo();
    } catch (error) {        
    }
});

applicationFilter2.addEventListener("change", async function(event) {
    event.preventDefault();    
    try {
        await getRegisteredInfo();
    } catch (error) {        
    }
});

btnHistory.addEventListener("click", async function (event){
    try { 
        await getApplicantInfo();
        btnHistory.style.borderBottom = '2px solid black';
        btnHistory.style.fontWeight = '600';
        btnEvent.style.borderBottom = 'none';
        btnEvent.style.fontWeight = 'normal';
        btnRecord.style.borderBottom = 'none';
        btnRecord.style.fontWeight = 'normal';

    } catch (error) {
        
    }
});

btnEvent.addEventListener("click", async function (event){ 
    try {
        await getRegisteredInfo();
        btnEvent.style.borderBottom = '2px solid black';
        btnEvent.style.fontWeight = '600';
        btnHistory.style.borderBottom = 'none';
        btnHistory.style.fontWeight = 'normal';
        btnRecord.style.borderBottom = 'none';
        btnRecord.style.fontWeight = 'normal';
    } catch (error) {
        
    }
});

btnRecord.addEventListener("click", async function (event){ 
    try {
        await getRegisteredInfo();
        btnRecord.style.borderBottom = '2px solid black';
        btnRecord.style.fontWeight = '600';
        btnHistory.style.borderBottom = 'none';
        btnHistory.style.fontWeight = 'normal';
        btnEvent.style.borderBottom = 'none';
        btnEvent.style.fontWeight = 'normal';
    } catch (error) {
        
    }
});

const allPages = document.querySelectorAll('div.page');
allPages[0].style.display = 'block';

function navigateToPage(event) {
  const pageId = location.hash ? location.hash : '#history';
  for (let page of allPages) {
    if (pageId === '#' + page.id) {
        if(pageId === "#history"){
            btnHistory.style.borderBottom = '2px solid black';
            btnHistory.style.fontWeight = '600';
            btnEvent.style.borderBottom = 'none';
            btnEvent.style.fontWeight = 'normal';
        } else if(pageId === "#commitment"){
            btnEvent.style.borderBottom = '2px solid black';
            btnEvent.style.fontWeight = '600';
            btnHistory.style.borderBottom = 'none';
            btnHistory.style.fontWeight = 'normal';
        } else if(pageId === "#record"){
            btnEvent.style.borderBottom = '2px solid black';
            btnEvent.style.fontWeight = '600';
            btnHistory.style.borderBottom = 'none';
            btnHistory.style.fontWeight = 'normal';
            window.location.href = "volunteer_record.html";
        }
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }
  return;
}
navigateToPage();

// init handler for hash navigation
window.addEventListener('hashchange', navigateToPage);

// event.target.parentElement.id



