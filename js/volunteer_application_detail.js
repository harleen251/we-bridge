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
        const applicant_info = document.getElementById("applicant_info");
        applicant_info.innerHTML = `<img src = "${volunteerData.photoLink}" alt = "profile photo">
                                <h2>${volunteerData.firstName} ${volunteerData.lastName}</h2>
                                <p>${volunteerData.city}, ${volunteerData.province}</p>
                                <section>
                                <h3>Bio:</h3>
                                <p>${volunteerData.bio}</p>
                                </section>
                                <section>
                                <h3>Email:</h3>
                                <p>${volunteerData.email}</p>
                                </section>
                                <section>
                                <h3>Contact Number:</h3>
                                <p>${volunteerData.phoneNumber}</p>
                                </section>
                                <section>
                                <h3>Introduce yourself and tell us why you want to volunteer for this opportunity?</h3>
                                <p id="motive"></p>
                                </section>`;
                                
                        
                                let h3 = document.createElement("h3");
                                h3.innerHTML = "Work Experience";
                                applicant_info.append(h3)
                                volunteerData.experience.forEach(function(exp) {
                                    let p = document.createElement("p");
                                    p.innerHTML = `${exp.jobTitle}`
                                    applicant_info.append(p);
                                    let p1 = document.createElement("p");
                                    p1.innerHTML = `${exp.company}`
                                    applicant_info.append(p1);
                                    let p2 = document.createElement("p");
                                    p2.innerHTML = `${exp.startDate} - ${exp.endDate}`
                                    applicant_info.append(p2);
                                })
                    
                                let h3_1 = document.createElement("h3");
                                h3_1.innerHTML = "Professional Certificate";
                                applicant_info.append(h3_1);
                                volunteerData.certificate.forEach(function(cert) {
                                    let p3 = document.createElement("p");
                                    p3.innerHTML = `${cert.certificateName}`
                                    applicant_info.append(p3);
                                    let p4 = document.createElement("p");
                                    p4.innerHTML = `${cert.dateObtained}`
                                    applicant_info.append(p4);
                                    let p5 = document.createElement("p");
                                    p5.innerHTML = `${cert.issuingOrg}`
                                    applicant_info.append(p5);
                                })
                    
                                let h3_2 = document.createElement("h3");
                                h3_2.innerHTML = "Skills";
                                applicant_info.append(h3_2);
                                volunteerData.skills.forEach(function(skill) {
                                    let p6 = document.createElement("p");
                                    p6.innerHTML = `${skill}`
                                    applicant_info.append(p6);
                                })
                    
                                let h3_3 = document.createElement("h3");
                                h3_3.innerHTML = "Language";
                                applicant_info.append(h3_3);
                                let p7 = document.createElement("p");
                                p7.innerHTML = `${volunteerData.language}`
                                applicant_info.append(p7);
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
                            submissionDate.innerHTML = postData.posted_on_date.toDate().toLocaleDateString();
                            approvedDate.innerHTML = application.dateApplied.toDate().toLocaleDateString();
                            motive.innerHTML = application.motive;
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