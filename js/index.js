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
const appCollection = collection(db, "application");
const organizationCollection = collection(db, "organization"); //organizationId

// Retrieve the volunteerId and OrganizationId from the cookie
let volunteerId = "";
let organizationId = "";

getCookie('volunteerId')
  .then((cookieValue) => {
    if (cookieValue !== null) {
      // Cookie found, use cookieValue
      if (cookieValue !== "") {
        volunteerId = cookieValue;
      } else {
        // Cookie not found
        getCookie('organizationId')
          .then((cookieValue) => {
              if (cookieValue !== null) {
              // Cookie found, use cookieValue
                if (cookieValue !== "") {
                    organizationId = cookieValue;
                                       
                } else {
                }              
              } 
          })
          .catch((error) => {
          });
      }      
    } 
  })
  .catch((error) => {
    //console.error('An error occurred while retrieving the cookie:', error);
  });




const today = Timestamp.now();
// const expireDate = Timestamp.fromDate(today);

const q = query(postCollection,
    where('expireDate', '>', today),
    orderBy('expireDate','desc'),
    orderBy('posted_on_date','desc'),
    limit(4));
let i = 1;

await getDocs(q)
.then((querySnapshot) => {
    querySnapshot.forEach((postdoc) => {
    const post = postdoc.data();
   
    console.log('post.organizationId : ' + post.organizationId)  ;
    const orgRef = doc(organizationCollection, post.organizationId);
    getDoc(orgRef)
        .then((orgsnapshot) => {
            let organizationdata = orgsnapshot.data();
            console.log("Organization name:", organizationdata.orgName);
            console.log("Organization photoLink:", organizationdata.photoLink); 
            // let txtInner = `<header><h1>${post.positionTitle}</h1></header>`;    
            let txtInner = ""; 
            console.log("Latest " + i);
            i++;
            let cardDiv = document.createElement("div"); // create new Div, cardDiv to display details data             
            cardDiv.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......           
           
            txtInner += `<div id="card_org"><img class="card_img" src="${organizationdata.photoLink}"> <p class="card_org_name">${organizationdata.orgName}</p></div>`;
            txtInner += `<div class="card_post_info">
                            <a href="post_detail.html" data-postId="${postdoc.id}">
                            ${post.positionTitle}
                            </a>
                            <p class="post_description_excerpt">${post.description}</p>
                            <div id="card_date_location_container">
                                <div id="card_date_container"><img class="card_icons" src="../images/icons/date.svg"><p class="post_date">${post.date.toDate().toLocaleDateString()}</p></div>
                                <div id="card_location_container"><img class="card_icons" src="../images/icons/location.svg"><p class="post_location">${post.location}</p></div>
                            </div>
                        </div>` 
                                    // onclick="handleViewButtonEvent(event)"
            cardDiv.innerHTML = txtInner;
            cardDiv.setAttribute("data-postId", postdoc.id);  
            cardDiv.addEventListener('click', handleViewButtonEvent);
            containerOpp.appendChild(cardDiv); // add cardDiv to orderDiv     
        })
        .catch((error) => {
                console.error("Error getting document:", error);
        });  
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
        let qPost = query(postCollection, where('expireDate', '>', today), orderBy('expireDate','desc'), orderBy('date', 'desc'), limit(4)); 
        let interestArr = [];
        console.log("Vol Interest Arr : ", volunteerData.interest.length);
        if ( volunteerData.interest.length > 0 ){
            volunteerData.interest.forEach(element => {
                interestArr.push(element);
            });
            console.log(interestArr);
            qPost = query(postCollection,
                     where("interests", "array-contains-any", interestArr), 
                     where('expireDate', '>', today),
                     orderBy('expireDate','desc'),
                     orderBy('date', 'desc'), limit(4));       
        }        

        await getDocs(qPost)
            .then((querySnapshot) => {
                querySnapshot.forEach((postDoc) => {
                    const post = postDoc.data();
                    
                    let qApp = query(appCollection, where ('postsID', '==', postDoc.id));
                    getDocs(qApp)
                        .then((appSnapshot) => {
                                appSnapshot.forEach((appDoc) => {
                                let appData = appDoc.data();
                                if (appData.volunteerID != volunteerId){
                                    console.log("NOT volunteerID and " + "postDoc.id : " + postDoc.id);
                                    ////////////////////////////// Organization Info /////////////////////////////////////
                                    
                                    const orgRef = doc(organizationCollection, post.organizationId);
                                    getDoc(orgRef)
                                        .then((orgsnapshot) => {
                                            let organizationdata = orgsnapshot.data();
                                            console.log("In Post Organization name:", organizationdata.orgName);
                                            console.log("In Post Organization photoLink:", organizationdata.photoLink);
                                            let card2Div = document.createElement("div"); // create new Div, cardDiv to display details data             
                                            card2Div.setAttribute("class", "card"); // set the class, card to cardDiv ..... ${imgPath} .......     
                                            document.getElementById("h1Recomm").style.display = "block";  
                                            // let txt2Inner = `<h1>${post.positionTitle}</h1>`; 
                                            let txt2Inner = "";                                                  
                                            txt2Inner += `<div id="card_org"><img class="card_img" src="${organizationdata.photoLink}"> <p class="card_org_name">${organizationdata.orgName}</p></div>`;
                                            txt2Inner += `<div class="card_post_info">
                                                            <a href="post_detail.html" data-postId="${postDoc.id}">
                                                            ${post.positionTitle}
                                                            </a>
                                                            <p class="post_description_excerpt">${post.description}</p>
                                                            <div id="card_date_container"><img class="card_icons" src="../images/icons/date.svg"><p class="post_date">${post.date.toDate().toLocaleDateString()}</p></div>
                                                            <div id="card_location_container"><img class="card_icons" src="../images/icons/location.svg"><p class="post_location">${post.location}</p></div>
                                                        </div>`;
                                        
                                            card2Div.innerHTML = txt2Inner;     
                                            card2Div.setAttribute("data-postId", postDoc.id);  
                                            card2Div.addEventListener('click', handleViewButtonEvent);
                                            containerRec.appendChild(card2Div); // add cardDiv to orderDiv      
                                    })
                                    .catch((error) => {
                                            console.error("Error getting document:", error);
                                    }); 
                                    ////////////////////////////// Organization Info /////////////////////////////////////                                    
                                }
                            });
                        })
                        .catch((error) => {
                            console.error('Error fetching application data:', error);
                        }); 
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

// async function logout() {
//     // Clear cookies
//     await setCookie("organizationId", "", 1);
//     await setCookie("volunteerId", "", 1);
//     console.log("organizationId", getCookie("organizationId"));
//     console.log("volunteerId", getCookie("volunteerId"));
//     window.location.href = 'index.html';
//   }

// btnLogout.addEventListener('click', function (event) {
//     event.preventDefault();    
//     logout(); 
// });

async function handleViewButtonEvent(event) {
    let postId = event.target.getAttribute('data-postId');
   await setCookie("postId", postId, 1);
   await setCookie("vol_postId", postId, 1);
   await setCookie("signal", "false", 1)
   window.location.href = "post_detail.html";
}

async function handleViewButtonEvent2(event) {
    let postId = event.currentTarget.getAttribute('data-postId');
    
   await setCookie("postId", postId, 1);
   await setCookie("vol_postId", postId, 1);
   await setCookie("signal", "false", 1)
   window.location.href = "post_detail.html";
}


window.addEventListener('offline', () => {
    //alert('You are now offline!'); // Customize the alert as needed
    //window.open('../pages/offline.html', 'Offline', 'width=400,height=300');
    const offlineAnimationContainer = document.getElementById('offlineAnimationContainer');
    offlineAnimationContainer.style.display = 'block';
    offlineAnimationContainer.style.background = '#f44336';
    offlineAnimationContainer.innerHTML = '<p>You are currently offline. Please check your internet connection.</p>';

    // You can customize the duration the animation is displayed
    setTimeout(() => {
    offlineAnimationContainer.style.display = 'none';
    }, 8000); // Adjust the duration (in milliseconds) as needed
});
  
window.addEventListener('online', () => {
    //alert('You are now back online!'); // Customize the alert as needed
    
    const offlineAnimationContainer = document.getElementById('offlineAnimationContainer');
    offlineAnimationContainer.style.display = 'block';
    offlineAnimationContainer.style.background = 'green';
    offlineAnimationContainer.innerHTML = '<p>You are now back online!</p>';

    // You can customize the duration the animation is displayed
    setTimeout(() => {
    offlineAnimationContainer.style.display = 'none';
    }, 5000); // Adjust the duration (in milliseconds) as needed
});
