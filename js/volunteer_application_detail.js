import { initializeApp} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js';
import { getCookie, setCookie} from "./backend.js"

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

const db = getFirestore(firebassApp);

// Reference to the volunteer collection
const volunteerCollection = collection(db, "volunteer");

// Retrieve the user's ID from the cookie
const volunteerId = await getCookie("volunteerId");
const vol_applicationId = await getCookie("vol_applicationId");
const vol_postId = await getCookie("vol_postId");

console.log(volunteerId);
console.log(vol_applicationId);
console.log(vol_postId);

async function getVolunteerInfo(){
    const docRef = doc(volunteerCollection, volunteerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const volunteerData = docSnap.data();
        console.log("Document data:", volunteerData);
        document.getElementById('volunteerName').innerHTML = volunteerData.firstName;
        document.getElementById('txtFirstName').innerHTML =  volunteerData.firstName + " " + volunteerData.lastName;
        document.getElementById('profilePic').src = (volunteerData.photoLink == null ? " " : volunteerData.photoLink);
        document.getElementById('txtBio').innerHTML = (volunteerData.bio == null ? " " : volunteerData.bio);
        document.getElementById('txtCity').innerHTML = (volunteerData.city == null ? " " : volunteerData.city);
        document.getElementById('txtProvince').innerHTML = (volunteerData.province == null ? " " : volunteerData.province);
        document.getElementById('txtSkill').innerHTML = (volunteerData.skills == null ? " " : volunteerData.skills.join(',') );
        document.getElementById('txtEmail').innerHTML = (volunteerData.email == null ? " " : volunteerData.email );
        document.getElementById('txtPhoneNumber').innerHTML = (volunteerData.phoneNumber == null ? " " : volunteerData.phoneNumber);
        getApplicantInfo();
        
    } else {
        console.log("No such document!");
    }
}

async function getApplicantInfo() {
    const applicationCollection = collection( db, 'application' );
    const applicationRef = doc(applicationCollection, vol_applicationId);
    await getDoc(applicationRef)
            .then((querySnapshot) => {
                if (querySnapshot.exists) {
                    const application = querySnapshot.data();                   
                    console.log("application.postsID : "+  application.postsID);
                    const postsCollection = collection( db, 'posts' ); 
                    const postRef = doc(postsCollection, application.postsID);
                    getDoc(postRef)
                        .then((postDoc) => {
                            if (postDoc.exists) {
                            const postData = postDoc.data();
                            console.log(postData.positionTitle);
                            appName.innerHTML = "Application for " + postData.positionTitle;
                            submissionDate.innerHTML = postData.posted_on_date.toDate();
                            approvedDate.innerHTML = application.dateApplied.toDate();
                            } else {
                                console.log('Post with postId not found.');
                            }})
                        .catch((error) => {
                            console.error('Error fetching post details:', error);
                        });                  
                }                
            })
            .catch((error) => {
                console.error('Error fetching application data:', error);
            });            
}
  
  // Call the function when the window loads
  window.onload = getVolunteerInfo();

document.getElementById("btnViewPost").addEventListener("click", function (event) {
    event.preventDefault();
    const pageURL = "volunteer_post_detail.html";
    window.location.href = pageURL;
});