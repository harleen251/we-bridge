import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, where, query, orderBy, getDoc, addDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getCookie, setCookie} from "./backend.js"
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
const volRef = collection(db, 'volunteer');

const search = document.getElementById('search');
const output = document.getElementById('eventDetails');
const searchInput = document.getElementById('searchInput');
const interestsSelect = document.getElementById('interests');
const skillsSelect = document.getElementById('skills');
const radiusRadios = document.querySelectorAll('input[type="radio"][name="radius"]');
let radius = 10;

const defaultQuery = query(colRef, orderBy("date", "desc")); // Default query, ordering by date in descending order

window.addEventListener('load', displayAllPosts);

function displayAllPosts() {
  // Execute the default query
  const q = defaultQuery;

  // Clear the output area
  output.innerHTML = '';

  // Get the query results and display all posts
  getDocs(q)
    .then((snapshot) => {
      snapshot.docs.forEach(doc => {
        const event = { ...doc.data(), id: doc.id };
        radius = getSelectedRadius();
        if (filteredPostWithinRadius(event, radius)) {
          const div = createEventDiv(event);
          div.setAttribute("class", "card");

          output.appendChild(div);
        }
      });
    })
    .catch(err => {
      console.log(err.message);
    });
}


search.addEventListener("click", performSearch);


async function performSearch(e) {
  e.preventDefault();
  output.innerHTML = '';
  const keyWord = searchInput.value.toLowerCase();
  const interests = interestsSelect.value;
  const skills = skillsSelect.value;
  radius = getSelectedRadius();

  let matchingDocs = [];

  if(interests == "Interests" && skills == "Skills"){
    // Only use keywords
      const snapshot = await getDocs(colRef);
      matchingDocs = snapshot.docs.filter((doc) => doc.data().positionTitle.toLowerCase().includes(keyWord));
  }

  if (interests !== "Interests" && skills !== "Skills") { //兴趣和技能都有值
    // combine interests and skills
    const interestsQuery = query(colRef, where("interests", "array-contains", interests));
    const skillsQuery = query(colRef, where("skills", "array-contains", skills));

    const interestsSnapshot = await getDocs(interestsQuery);
    const skillsSnapshot = await getDocs(skillsQuery);

    const interestsDocs = interestsSnapshot.docs;
    const skillsDocs = skillsSnapshot.docs;

    matchingDocs = interestsDocs.filter((interestsDoc) => {
      return skillsDocs.some((skillsDoc) => interestsDoc.id === skillsDoc.id);
    });
    matchingDocs = matchingDocs.filter((doc) => doc.data().positionTitle.toLowerCase().includes(keyWord));
  }

  if (interests !== "Interests") {
    // Only use interests
    const interestsQuery = query(colRef, where("interests", "array-contains", interests));
    const interestsSnapshot = await getDocs(interestsQuery);
    matchingDocs = interestsSnapshot.docs.filter((doc) => doc.data().positionTitle.toLowerCase().includes(keyWord));;
  }

  if (skills !== "Skills") { 
    // Only use skills
    const skillsQuery = query(colRef, where("skills", "array-contains", skills));
    const skillsSnapshot = await getDocs(skillsQuery);
    matchingDocs = skillsSnapshot.docs.filter((doc) => doc.data().positionTitle.toLowerCase().includes(keyWord));;
  }


  matchingDocs.forEach(doc => {
    const event = { ...doc.data(), id: doc.id };
    if (filteredPostWithinRadius(event, radius)) {
      const div = createEventDiv(event);
      output.appendChild(div);
    }
  });

  resetSearchFields();
}



function getSelectedRadius() {
  const selectedRadio = Array.from(radiusRadios).find(radio => radio.checked);
  return selectedRadio ? parseInt(selectedRadio.value, 10) : 10;
}

function createQuery(interests, skills) {
  let q = colRef;
  if (interests != "Interests") {
    q = query(q, where("interests", "array-contains", interests));
  }
  if (skills != "Skills") {
    q = query(q, where("skills", "array-contains", skills));
  }
  return q;
}
// Get the volunteer's latitude and longitude coordinates (assuming you have access to them)
// const volunteerLatitude = 49.22459940676005;
// const volunteerLongitude = -123.10192130145963;
let geopoint = " "
const volunteerId = await getCookie("volunteerId");



async function getVolunteerDetails(volunteerId) {
  const volRef = doc(db, 'volunteer', volunteerId);
  const docSnap = await getDoc(volRef);
  if (docSnap.exists()) {
      geopoint = docSnap.data().geopoint;
      console.log("geopoint", geopoint);
      return geopoint;
  } else {
    return {};
  }
}


async function filteredPostWithinRadius(event, radius) {
  if (radius != 0) {
        try {let volunteerCoordinates = await getVolunteerDetails(volunteerId);
          console.log("volunteerCoordinates", volunteerCoordinates);
        let volunteerLatitude = volunteerCoordinates._lat;
        let volunteerLongitude = volunteerCoordinates._long;
        let postLatitude = event.locationCoordinates._lat;
      let postLongitude = event.locationCoordinates._long;
      
      console.log("volunteerLatitude", volunteerLatitude);
      console.log("volunteerLongitude", volunteerLongitude);
      console.log("postLatitude", postLatitude);
      console.log("postLongitude", postLongitude);

    
        const earthRadius = 6371; // Earth's radius in kilometers
        // Calculate the distance between the volunteer and the post using Haversine formula
        //  great-circle distance between two points on a sphere 
        // const dLat = (postLatitude - volunteerLatitude) * (Math.PI / 180);
        // const dLon = (postLongitude - volunteerLongitude) * (Math.PI / 180);
        // const a =
        //   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        //   Math.cos(volunteerLatitude * (Math.PI / 180)) * Math.cos(postLatitude * (Math.PI / 180)) *
        //   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // const distance = earthRadius * c;
        // console.log('distance is', distance);
        // console.log("distance <= radius", distance <= radius);
        // let flag =  distance <= radius; // Check if the post is within the specified radius

        const dlat = postLatitude - volunteerLatitude;
    const dlon = postLongitude - volunteerLongitude;
    console.log("dlat", dlat);
    console.log("dlon", dlon);

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(volunteerLatitude) * Math.cos(postLatitude) * Math.sin(dlon / 2) ** 2;
    console.log("a is", a);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Earth's radius in kilometers (mean value)
    const R = 6371;

    // Calculate the distance
    const distance = R * c;
    console.log('distance is', distance);
    let flag = distance <= radius;
    

    // return distance;
        if (flag) {
          return flag;
        }
        return 0;}
        catch(error){
          console.error(error);
          return false;
        }
}}



function navigateToPostDetailPage(eventId){
  setCookie("vol_postId", eventId, 1);
  setCookie("signal", "false", 1)
  const postDetailPageURL = `../pages/post_detail.html`
  window.location.href = postDetailPageURL
}

function createEventDiv(event) {
  const div = document.createElement('div');
  const date = new Date(event.date.toDate()); 
  const expireDate = new Date(event.expireDate.toDate()); 
  div.innerHTML = `<br><h3>${event.positionTitle} </h3>
    ${event.description} <br>
    <br>  ${date.toLocaleString()}
    <br>  ${event.location} `;
    div.addEventListener("click", ()=>{
      navigateToPostDetailPage(event.id);
    })
  // const applyButton = createApplyButton(event.id);
  // div.appendChild(applyButton);
  return div;
}



function resetSearchFields() {
  searchInput.value = '';
  interestsSelect.value = 'Interests';
  skillsSelect.value = 'Skills';
}

