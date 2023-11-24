import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, where, query, orderBy, getDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import {getCookie, setCookie} from "./backend.js"
const firebaseConfig = {
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"

  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore();
  const colRef = collection(db, 'posts');
  
  window.addEventListener('load', applicationDetail);
  window.addEventListener('load', recommendations);
  
  //const urlParams = new URLSearchParams(window.location.search);
  

  // Get cookie from organization side for viewing post
  let org_postId
  let vol_postId
  let signal
  try {
      org_postId = await getCookie("idPost");    
  }
  catch (error) {
      console.error("Error getting org_cookie:", error);
  }

  try {
    vol_postId = await getCookie("vol_postId"); 
  } catch (error) {
    console.error("Error getting vol_cookie:", error);
  }

  try {
    signal = await getCookie("signal"); 
  } catch (error) {
    console.error("Error getting gs_cookie:", error);
  }

  let postId;
  if (org_postId == "" || org_postId == undefined ) {
    console.log("1")
      postId = vol_postId;
      if(signal == "true"){
        document.getElementById("similar_opportunities").style.display = "none";
        document.querySelector('.post_detail').style.display = "block"
        document.getElementById("opportunity_detail").style.width = "95%"
      }
  } 
   else {
      // Get cookie from volunteer side
      postId = org_postId;
      console.log("2")
      document.getElementById("similar_opportunities").style.display = "none";
      document.querySelector('.post_detail').style.display = "block"
      document.getElementById("opportunity_detail").style.width = "95%"
   }


  let organizationId = ""; 
  // urlParams.get('id');
  console.log("Cookie postID" , postId)
  const opportunity_detail = document.getElementById("opportunity_detail")
  const similar_opportunities = document.getElementById("similar_opportunities")
  const docRef = doc(colRef, postId)
  
  function applicationDetail() {
      opportunity_detail.innerHTML = "";
      getDoc(docRef)
          .then((doc1) => {
              if (doc1.exists()) {
                  // Document exists, and you can access its data
                  const data = doc1.data();
                  const date = new Date(data.date.toDate());
                  const expireDate = new Date(data.expireDate.toDate());
                  const postOnDate = new Date(data.posted_on_date.toDate());
                  organizationId = data.organizationId;
                  getDoc(doc(collection(db,'organization'),organizationId))
                    .then((doc2) => {
                      if(doc2.exists()){
                        const photoLink = doc2.data().photoLink;
                        opportunity_detail.innerHTML =
                            ` 
                            <div class="div1">
                            <img src= "${photoLink}" alt = "profile image">
                            <h1> ${data.positionTitle}</h1>
                            <p>${data.orgName}</p>
                            <div id="postDate">
                            <p> Posted on: ${postOnDate.toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })} </p>
                            <p> Expired on: ${expireDate.toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })} </p>
                            </div class="div2">
                            </div>
                            <div id="btns"> </div>
                            <div class="div3">
                            <p> <i class="fa-solid fa-calendar-days" style="color: #8f8f8f;"></i>  ${date.toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })} </p>
                            <p> <i class="fa-solid fa-clock" style="color: #8f8f8f;"></i> ${data.hours} Hours </p>
                            <p> <i class="fa-solid fa-location-dot" style="color: #8f8f8f;"></i> ${data.location} </p>
                            <p> <i class="fa-solid fa-globe" style="color: #8f8f8f;"></i> ${data.preferredLanguage} </p>
                            <p> <i class="fa-solid fa-star" style="color: #8f8f8f;"></i> ${data.interests} </p>
                            <p> <i class="fa-solid fa-desktop" style="color: #8f8f8f;"></i> ${data.mode_of_work} </p>
                            </div>
                            <div class="div4">
                            <h3>Descriptions</h3>
                            <p> ${data.description} </p></div>
                            </div>
                            `;

                            const postDate = document.getElementById('postDate');
                            const btns = document.getElementById('btns');
                            // Display the apply button,only if the cookie from organization side for postId is undefined
                            if((org_postId === "" || org_postId == undefined )&& signal === "false") {
                              const applyButton = createApplyButton(doc1.id);
                              const orgPro = document.createElement('button');
                              orgPro.textContent = 'Organization Profile'
                              orgPro.className = 'proBtn'
                              btns.appendChild( orgPro);
                              btns.appendChild( applyButton);
                            }
                      }
                    }).catch((error) =>{

                    })
                
              } else {
                  // Document does not exist
                  console.log('Document does not exist.');
              }
          })
          .catch((error) => {
              console.error('Error getting document:', error);
          });
  }
  const recommendedPosts = [];
  const recommendedPostsId = [];

  function recommendations() {
    similar_opportunities.innerHTML = "<h1>Similar Opportunities</h1>"; // Clear previous recommendations
      
    getDoc(docRef)
      .then((doc1) => {
        if (doc1.exists) {
          const data = doc1.data();
          const interests = data.interests; // Get interests of the current post
          // Create a query to find other posts with the same interests
          const queryRef = query(colRef, where("interests", "array-contains-any", interests));
  
          getDocs(queryRef)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc3) => {
                if (doc3.id !== postId) {
                  recommendedPosts.push(doc3);
                  recommendedPostsId.push(doc3.id);
                }
              });
  
              if (recommendedPosts.length > 0) {
                for (let i = 0; i < Math.min(recommendedPosts.length, 3); i++) {
                  const recommendationDiv = document.createElement("div");
                  const recommendedData = recommendedPosts[i].data();
                  const date = new Date(recommendedData.date.toDate());
                  let description = recommendedData.description
                  if (recommendedData.description.length > 30) {
                    description = recommendedData.description.slice(0, 30) + '...';
                } else {
                    description = recommendedData.description;
                }
                  console.log(recommendedPostsId[i])

                   organizationId = recommendedData.organizationId;
                  getDoc(doc(collection(db,'organization'),organizationId))
                    .then((doc2) => {
                      if(doc2.exists()){
                        const photoLink = doc2.data().photoLink;

                  // Create a div containing the details
                 
                  recommendationDiv.addEventListener("click", () => {
                    navigateToPostDetailPage(recommendedPostsId[i]);
                  });
                  recommendationDiv.innerHTML += `
                    <img src= "${photoLink}" alt = "profile image">
                    <p class="orgName">${recommendedData.orgName}</p>
                    <h2>${recommendedData.positionTitle}</h2>
                    <p>${description}</p>
                    <p><i class="fa-solid fa-calendar-days" style="color: #8f8f8f;"></i>  ${date.toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}</p>
                    <p><i class="fa-solid fa-location-dot" style="color: #8f8f8f;"></i> ${recommendedData.location}</p>
                    <br>
                  `;
  
                  // Append recommendationDiv to similar_opportunities
                      }
                    }).catch((error) =>{

                    })
                  
                  similar_opportunities.appendChild(recommendationDiv);
                }
  
                if (recommendedPosts.length > 3) {
                  // If there are more posts to show, add "Show more" button
                  const showMoreButton = document.createElement("button");
                  showMoreButton.textContent = "Show more";
                  showMoreButton.className = "showMoreButton"
                  showMoreButton.addEventListener("click", () => showMoreRecommendations(3));
                  similar_opportunities.appendChild(showMoreButton);
                }
              } else {
                similar_opportunities.innerHTML = "No similar opportunities found.";
              }
            })
            .catch((error) => {
              console.error("Error getting recommended documents:", error);
            });
        } else {
          console.log("Document does not exist.");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
}

function showMoreRecommendations(startIndex) {
    const maxToShow = 3;
    for (let i = startIndex; i < startIndex + maxToShow; i++) {
        if (i < recommendedPosts.length) {
            const recommendedData = recommendedPosts[i].data();
            const date = new Date(recommendedData.date.toDate());
            let description = recommendedData.description
                  if (recommendedData.description.length > 30) {
                    description = recommendedData.description.slice(0, 30) + '...';
                } else {
                    description = recommendedData.description;
                }
            // Create a div containing the details
            const recommendationDiv = document.createElement("div");
            recommendationDiv.addEventListener("click", () => {
                navigateToPostDetailPage(recommendedPostsId[i]);
            });
            organizationId = recommendedData.organizationId;
                  getDoc(doc(collection(db,'organization'),organizationId))
                    .then((doc2) => {
                      if(doc2.exists()){
                        const photoLink = doc2.data().photoLink;

                  // Create a div containing the details
                 
                  recommendationDiv.addEventListener("click", () => {
                    navigateToPostDetailPage(recommendedPostsId[i]);
                  });
                  recommendationDiv.innerHTML += `
                    <img src= "${photoLink}" alt = "profile image">
                    <p class="orgName">${recommendedData.orgName}</p>
                    <h2>${recommendedData.positionTitle}</h2>
                    <p>${description}</p>
                    <p><i class="fa-solid fa-calendar-days" style="color: #8f8f8f;"></i>  ${date.toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}</p>
                    <p><i class="fa-solid fa-location-dot" style="color: #8f8f8f;"></i> ${recommendedData.location}</p>
                    <br>
                  `;
  
                  // Append recommendationDiv to similar_opportunities
                      }
                    }).catch((error) =>{

                    })
  
            // Append recommendationDiv to similar_opportunities
            similar_opportunities.appendChild(recommendationDiv);
        }
    }
  
    const showMoreButton = document.querySelector(".showMoreButton");
    if (showMoreButton) {
        showMoreButton.style.display = "none";
    }
}

function createApplyButton(eventId) {
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.addEventListener('click', async() => {
    console.log("Button ID: " + eventId);
    let volunteerId
    try {
      volunteerId = await getCookie('volunteerId')
    } catch (error) {
      
    }
    if (volunteerId == "" || volunteerId == undefined) {
      window.location.href = "../pages/volunteer_login.html"
    } else{
      createPopupForApplication(eventId);
    }
  });
  return applyButton;
}

function createPopupForApplication(eventId) {
  // Create and display the application popup.
  const popupHTML = `
    <div class="popup">
      <div class="popup-content">
        <h2>Apply for this position</h2>
        <label for="contactNumber">Contact Number:</label>
        <input type="text" id="contactNumber" required>
        <br>
        <label for="applicationReason">Introduce yourself and tell us why you want to volunteer for this opportunity?</label>
        <textarea id="applicationReason" rows="4" required></textarea>
        <br>
        <div class="button-container">
        <button id="submitApplication">Submit</button>
        <button id="closePopup">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHTML);
  // Get the pop-up interface and related elements
  const popup = document.querySelector('.popup');
  const closePopup = document.getElementById('closePopup');
  const submitButton = document.getElementById('submitApplication');
  const contactNumberInput = document.getElementById('contactNumber');
  const applicationReasonInput = document.getElementById('applicationReason');

// Close the pop-up interface
  closePopup.addEventListener('click', () => {
    popup.remove();
  });

// Handle click event of submit button
  submitButton.addEventListener('click', async () => {
    let volunteerId
    try {
      volunteerId = await getCookie('volunteerId')
    } catch (error) {
      
    }
      const contactNumber = contactNumberInput.value;
      const applicationReason = applicationReasonInput.value;
  //     getCookie('volunteerId')
  //     .then((cookieValue) => {
  //       if (cookieValue !== null) {
  //         // Cookie found, use cookieValue
  //         if (cookieValue !== "") {
  //           volunteerId = cookieValue;
  //           console.log(`volunteerId value: ${cookieValue}`); 
  //         }      
  //       } 
  // })
  // .catch((error) => {
  //   //console.error('An error occurred while retrieving the cookie:', error);
  // });

  var currentDate = new Date();
  
 

  const docRef = doc(db, "posts", eventId);

  try {
    const doc = await getDoc(docRef); 

    if (doc.exists()) {
      
       organizationId = doc.data().organizationId;
      console.log("organizationId" , organizationId);
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }

  try {
    await addDoc(collection(db, 'application'), {
      contactNumber: contactNumber,
      motive: applicationReason,
      volunteerID: volunteerId,
      postsID: eventId,
      status: "applied",
      organizationId: organizationId, 
      dateApplied: currentDate,
    });

    alert("Application submitted successfully!");
    const prevUrl = document.referrer; 
    let redirectURL = "index.html"

    if (prevUrl !== ""){
      redirectURL = document.referrer;
    }
    window.location.href = redirectURL;
  } catch (error) {
    console.error("Error adding document: ", error);
    // alert("An error occurred while submitting the application.");
  }
    
  

  // Close the pop-up interface
  popup.remove();
 })}

 function navigateToPostDetailPage(eventId){
  setCookie('vol_postId', eventId, 1);
  setCookie("signal", "false", 1)
  const postDetailPageURL = `../pages/post_detail.html`
  window.location.href = postDetailPageURL
}

    

