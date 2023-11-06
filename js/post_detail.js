import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, where, query, orderBy, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import {createApplyButton, createPopupForApplication, navigateToPostDetailPage, getCookie} from "./backend.js"

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
  
  const urlParams = new URLSearchParams(window.location.search);
  const postId = await getCookie("vol_postId");
  // urlParams.get('id');
  console.log(postId)
  const opportunity_detail = document.getElementById("opportunity_detail")
  const similar_opportunities = document.getElementById("similar_opportunities")
  const docRef = doc(colRef, postId)
  
  function applicationDetail() {
      opportunity_detail.innerHTML = "";
      getDoc(docRef)
          .then((doc) => {
              if (doc.exists()) {
                  // Document exists, and you can access its data
                  const data = doc.data();
                  const date = new Date(data.date.toDate());
                  const expireDate = new Date(data.expireDate.toDate());
                  console.log('Document data:', data);
                  opportunity_detail.innerHTML =
                  `<br> <h1>Position Title: ${data.positionTitle}</h1>
                  <br> Posted on: ${data.posted_on_data} | Expired on: ${expireDate.toLocaleString()}
                  <br> Date: ${date.toLocaleString()} Hours: ${data.hours} Location: ${data.location}
                  <br> Preferred Language: ${data.preferredLanguage} Interests: ${data.interests} Mode of work: ${data.mode_of_work}
                  <br> Description: ${data.description}
                  `;
                  const applyButton = createApplyButton(doc.id);
                  opportunity_detail.appendChild(applyButton);
              } else {
                  // Document does not exist
                  console.log('Document does not exist.');
              }
          })
          .catch((error) => {
              console.error('Error getting document:', error);
          });
  }
  
  function recommendations() {
    similar_opportunities.innerHTML = ""; // Clear previous recommendations
  
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const interests = data.interests; // Get interests of the current post
  
          // Create a query to find other posts with the same interests
          const queryRef = query(colRef, where("interests", "==", interests));
  
          getDocs(queryRef)
            .then((querySnapshot) => {
              const recommendedPosts = [];
              const recommendedPostsId = [];
              querySnapshot.forEach((doc) => {
                if (doc.id !== postId) {
                  recommendedPosts.push(doc);
                  recommendedPostsId.push(doc.id);
                }
              });
  
              if (recommendedPosts.length > 0) {
                for (let i = 0; i < Math.min(recommendedPosts.length, 3); i++) {
                  const recommendedData = recommendedPosts[i].data();
                  const date = new Date(recommendedData.date.toDate());
                  console.log(recommendedPostsId[i])
                  // Create a div containing the details
                  const recommendationDiv = document.createElement("div");
                  recommendationDiv.addEventListener("click", () => {
                    navigateToPostDetailPage(recommendedPostsId[i]);
                  });
                  recommendationDiv.innerHTML = `
                    <p>Position Title: ${recommendedData.positionTitle}</p>
                    <p>Description: ${recommendedData.description}</p>
                    <p>Date: ${date.toLocaleString()}</p>
                    <p>Location: ${recommendedData.location}</p>
                    <br>
                  `;
  
                  // Append recommendationDiv to similar_opportunities
                  similar_opportunities.appendChild(recommendationDiv);
                }
  
                if (recommendedPosts.length > 3) {
                  // If there are more posts to show, add "Show more" button
                  const showMoreButton = document.createElement("button");
                  showMoreButton.textContent = "Show more";
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
  
            // Create a div containing the details
            const recommendationDiv = document.createElement("div");
            recommendationDiv.addEventListener("click", () => {
                navigateToPostDetailPage(recommendedPostsId[i]);
            });
            recommendationDiv.innerHTML = `
                <p>Position Title: ${recommendedData.positionTitle}</p>
                <p>Description: ${recommendedData.description}</p>
                <p>Date: ${date.toLocaleString()}</p>
                <p>Location: ${recommendedData.location}</p>
                <br>
            `;
  
            // Append recommendationDiv to similar_opportunities
            similar_opportunities.appendChild(recommendationDiv);
        }
    }
  
    if (startIndex + maxToShow >= recommendedPosts.length) {
        // If there are no more posts to show, hide the "Show more" button
        const showMoreButton = document.querySelector("#showMoreButton");
        showMoreButton.style.display = "none";
    }
}
