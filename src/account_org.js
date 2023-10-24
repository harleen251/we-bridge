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


// // Retrieve the user's ID from the cookie
//   const idOrganization = getCookie("organizationIdId");
const idOrganization = "hNEr10bBz2HUA0QlKkV0";

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

import { getFirestore, collection, getDoc ,doc , getDocs,
         query , where
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
};


initializeApp( firebaseConfig );

const db = getFirestore();

const colRef = collection( db, 'organization' );

async function orgProfileInfo() {
    const docRef = doc(colRef, idOrganization);

    let data =[]
    await getDoc(docRef)
        .then((snapshot) => {
            data = snapshot.data();
            console.log("Document data:", data);
            document.getElementById("welcome_tag").innerHTML = `Welcome ${data.name}`;
            let profile_info = document.getElementById("Profile_info")
            profile_info.innerHTML = `<h2>${data.name}</h2> 
                                        <p>${data.city},${data.province}</p>
                                        <p>${data.description}</p>`;
                                        for(let i = 0; i < data.serviceField.length; i++) {
                                            let p = document.createElement("p");
                                            p.innerHTML = data.serviceField[i];
                                            profile_info.appendChild(p);
                                        }
    })
    .catch((error) => {
            console.error("Error getting document:", error);
    });

}

// Call the function when the window loads
window.onload = orgProfileInfo();

function handleManageButtonEvent(event) {
    let postId = event.target.getAttribute('dataManagePostID');
    console.log("test manage addeventlistener");
    console.log(postId);
  
    setCookie('idPost', postId, 1);
 }


const postsRef = collection(db, 'posts');

async function getPostList() {
    const q = query(postsRef, where( "organizationID", "==" , idOrganization ));

    const currentDate = new Date();
    document.getElementById("post-list").innerHTML = "";
    await getDocs(q, postsRef)
        .then((snapshot) => {
            const filteredPosts = [];
    
            snapshot.forEach((doc) => {
                const post = {...doc.data(), id: doc.id};
                const expirationDate = post.expireDate.toDate();
                // console.log(expirationDate);
            
                if (expirationDate > currentDate) {
                    filteredPosts.push(post);
                }
            });
            // console.log(filteredPosts);
    
            filteredPosts.forEach((event)=> {
                const div = document.createElement('div');
                const postList = document.getElementById("post-list");
                postList.appendChild(div);
                const h3 = document.createElement('h3');
                h3.innerText = event.positionTitle;
                div.append(h3);
                const p = document.createElement('p');
                p.innerText = event.description;
                div.append(p);
                const p1 = document.createElement('p');
                p1.innerText = `Published: ${event.date.toDate().toLocaleDateString()}`;
                div.append(p1)
    
                let postId = event.id;
    
                const applicationRef = collection( db, 'application' );

                async function getAppliedAndApprovedNumber() {
                    const q = query(applicationRef, where("postsID", "==", postId));
    
                    let countApproved = 0;
                    let applicantsArray = []
                    await getDocs(q, applicationRef)
                        .then((snapshot) => {
                            // console.log(snapshot);
                            snapshot.docs.forEach(doc => {
                                applicantsArray.push(doc.data())
                            })
                            // console.log(applicantsArray);
                            const p2 = document.createElement('p');
                            p2.innerText = `Applicants: ${applicantsArray.length}`;
                            div.append(p2);
        
                            for(let i = 0; i < applicantsArray.length; i++) {
                                if(applicantsArray[i].status === "approved"){
                                    countApproved++;
                                }
                            }
                            const p3 = document.createElement('p');
                            p3.innerText = `Approved: ${countApproved}`;
                            div.append(p3);
        
                            const manageButton = document.createElement('button');
                            manageButton.setAttribute("class", "manageButton");
                            manageButton.setAttribute("dataManagePostID", postId);
                            manageButton.innerHTML = 'Manage Activity';
                            div.append(manageButton);
                            console.log("manage button appened");
                            manageButton.addEventListener('click', handleManageButtonEvent);  

                        })
                        .catch(err => {
                            console.log(err.message)
                        })
                }
                getAppliedAndApprovedNumber();
    
                
            })
    
      })
      .catch((error) => {
            console.error("Error getting posts:", error);
      });

}

const postTabViewButton = document.getElementById("postTabViewButton")
postTabViewButton.addEventListener("click", function (event){
    event.preventDefault();    
    try {
        getPostList();
    } catch (error) {
        
    }
});


//   Application Tab

function handleViewButtonEvent(event) {
    let volunteerId = event.target.getAttribute('data-volunteerID');
    let postId = event.target.getAttribute('data-postID');
    console.log("test addeventlistener");
    console.log(volunteerId);
    console.log(postId);
  
    setCookie('idVolunteer', volunteerId, 1); 
    setCookie('idPost', postId, 1);

    const pageURL = "org_applicant_detail.html";
    window.location.href = pageURL;
 }

const collectionRef = collection( db, 'application' );

async function getApplicationList() {
    document.getElementById("application-list").innerHTML = "";
    const q2 = query(collectionRef, where( "organizationID", "==" , idOrganization ));

    let applicationArray = [];
    await getDocs(q2, collectionRef)
        .then((snapshot) => {
            console.log(snapshot);
            snapshot.docs.forEach(doc => {
            applicationArray.push(doc.data())
            })
            console.log(applicationArray);
            applicationArray.forEach(event => {    
                
                const div = document.createElement('div');
                const applicationList = document.getElementById("application-list");
                applicationList.appendChild(div);

                const volunteercolRef = collection( db, 'volunteer' );

                async function getVolunteerDetails() {
                    const dRef = doc(volunteercolRef, event.volunteerID);
                    await getDoc(dRef)
                        .then((snapshot) => {
                            let data = snapshot.data();
                            const h3tag = document.createElement('h3');
                            h3tag.innerText = `${data.firstName} ${data.lastName}`;
                            div.append(h3tag);
        
                            const postsRef = collection(db, 'posts');

                            async function getPostDetails() {
                                const docsRef = doc(postsRef, event.postsID);
                                await getDoc(docsRef)
                                    .then((snapshot) => {
                                        data = snapshot.data();
                                        const p3 = document.createElement('p');
                                        p3.innerText = data.positionTitle;
                                        div.append(p3);
            
                                        const p5 = document.createElement('p');
                                        p5.innerText = `Submitted On: ${event.dateApplied.toDate().toLocaleDateString()}`;
                                        div.append(p5);
            
                                        const p4 = document.createElement('p');
                                        p4.innerText = `Post Expire: ${data.expireDate.toDate().toLocaleDateString()}`;
                                        div.append(p4);
            
                                        const viewButton = document.createElement('button');
                                        viewButton.setAttribute("class", "viewButton");
                                        viewButton.setAttribute("data-volunteerID", event.volunteerID);
                                        viewButton.setAttribute("data-postID", event.postsID);
                                        viewButton.innerHTML = 'View';
                                        div.append(viewButton);
                                        console.log("button appened");
                                        viewButton.addEventListener('click', handleViewButtonEvent);                                 
                                    })
                                    .catch(err => {
                                        console.log(err.message)
                                    })
                            }
                            getPostDetails();
                            
                        })
                        .catch(err => {
                            console.log(err.message)
                        })
                }
                getVolunteerDetails();
    
            });
            
    })
    .catch(err => {
            console.log(err.message)
    })   
}

const applicationTabViewButton = document.getElementById("applicationTabViewButton")
applicationTabViewButton.addEventListener("click", async function (event){
    event.preventDefault();    
    try { 
        await getApplicationList();
    } catch (error) {
        
    }
});





  

