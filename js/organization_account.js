import { getFirestore, collection, getDoc ,doc , getDocs, query , where, orderBy} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getCookie, setCookie} from "./backend.js"

// // Retrieve the user's ID from the cookie
const idOrganization = await getCookie("idOrganization");
// const idOrganization = "hNEr10bBz2HUA0QlKkV0";
console.log(idOrganization);

// window.addEventListener("pageshow", function(event) {
//     if (event.persisted) {
//       const dropdown = document.getElementById("postFilter");
//       dropdown.selectedIndex = 0;
//     }
// });
  

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
            document.getElementById("welcome_tag").innerHTML = `Welcome ${data.orgName}!`;
            let profile_info = document.getElementById("Profile_info")
            profile_info.innerHTML = `  <div>
                                        <img class="profile_pic" src= "${data.photoLink}" alt = "profile image">
                                        </div>
                                        <div>
                                        <h2>${data.orgName}</h2> 
                                        <p>${data.city}, ${data.province}</p>
                                        <p id="org_description">${data.description}</p>
                                        <div id="skillList_Org"></div>
                                        </div>`;
                                        for(let i = 0; i < data.service.length; i++) {
                                            let p = document.createElement("p");
                                            p.innerHTML = data.service[i];
                                            skillList_Org.appendChild(p);
                                        }
    })
    .catch((error) => {
            console.error("Error getting document:", error);
    });

}

// Call the function when the window loads
window.onload = orgProfileInfo();

async function handleManageButtonEvent(event) {
    let postId = event.target.getAttribute('dataManagePostID');
    console.log("test manage addeventlistener");
    console.log(postId);
  
    await setCookie('idPost', postId, 1);
    const pageURL = "organization_manage_activity.html";
    window.location.href = pageURL;
 }

 async function handleManageButton(event) {
    let postId = event.currentTarget.getAttribute("id");
    console.log("test manage addeventlistener");
    console.log(postId);
  
    await setCookie('idPost', postId, 1);
    const pageURL = "organization_manage_activity.html";

    window.location.href = pageURL;
 }


const postsRef = collection(db, 'posts');

async function getPostList() {
    
    const q = query(postsRef, where( "organizationId", "==" , idOrganization ), orderBy("date", "asc"));
    const postFilter = document.getElementById("postFilter").value;
    console.log(idOrganization);
    const currentDate = new Date();
    document.getElementById("post-list").innerHTML = "";
    await getDocs(q, postsRef)
        .then((snapshot) => {
            const filteredPosts = [];
    
            snapshot.forEach((doc) => {
                const post = {...doc.data(), id: doc.id};
                const startDate = post.date.toDate();
                if((postFilter === "Active") && (startDate >= currentDate)) {
                    filteredPosts.push(post);  
                } else if((postFilter === "Inactive/Closed") && (startDate < currentDate)) {
                    filteredPosts.push(post); 
                } else if( postFilter === "All" ) {
                    filteredPosts.push(post);
                }
                
            });
            console.log(filteredPosts);
    
            filteredPosts.forEach((event)=> {
                let postId = event.id;
                console.log(postId);
                const div = document.createElement('div');
                div.setAttribute("id", postId);
                div.setAttribute("class", "card");
                div.addEventListener('click', handleManageButton)

                const imgElement = document.createElement('img');
                imgElement.src = '../images/icons/black-left-arrow.svg'; 
                imgElement.width = 20; 
                div.append(imgElement);

                const postList = document.getElementById("post-list");
                postList.appendChild(div);
                const h3 = document.createElement('h3');
                h3.innerText = event.positionTitle;
                div.append(h3);
                const p = document.createElement('p');
                p.innerText = event.location;
                div.append(p);
                const div_0 = document.createElement('div');
                div.appendChild(div_0);
                const div_2 = document.createElement('div');
                div_0.appendChild(div_2);
                const p0 = document.createElement('p');
                p0.innerHTML = `Event<span> :<span>`;
                div_2.append(p0)
                const p0_1 = document.createElement('p');
                p0_1.innerText = `${event.date.toDate().toLocaleDateString('en-GB')}`;
                div_2.append(p0_1)
                // const p1 = document.createElement('p');
                // p1.innerText = `Published: ${event.posted_on_date.toDate().toLocaleDateString('en-GB')}`;
                // div.append(p1)
    
                
    
                const applicationRef = collection( db, 'application' );

                async function getAppliedAndApprovedNumber() {
                    const q = query(applicationRef, where("postsID", "==", postId));
    
                    let countApproved = 0;
                    let applicantsArray = []
                    await getDocs(q, applicationRef)
                        .then((snapshot) => {
                            snapshot.docs.forEach(doc => {
                                applicantsArray.push(doc.data())
                            })
                            
                            const div_1 = document.createElement('div');
                            div_0.appendChild(div_1);
                            const p2 = document.createElement('p');
                            p2.innerHTML = `Applicants<span> :<span>`;
                            div_1.append(p2);
                            const p2_1 = document.createElement('p');
                            p2_1.innerText = `${applicantsArray.length}`;
                            div_1.append(p2_1);
        
                            for(let i = 0; i < applicantsArray.length; i++) {
                                if((applicantsArray[i].status === "approved") || (applicantsArray[i].status === "complete")){
                                    countApproved++;
                                }
                            }

                            const div_2 = document.createElement('div');
                            div_0.appendChild(div_2);
                            const p3 = document.createElement('p');
                            p3.innerHTML = `Approved<span> :<span>`;
                            div_2.append(p3);
                            const p3_1 = document.createElement('p');
                            p3_1.innerText = `${countApproved}`;
                            div_2.append(p3_1);
        
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
    try {
        getPostList();
        postTabViewButton.style.borderBottom = '2px solid black';
        postTabViewButton.style.fontWeight = '600';
        applicationTabViewButton.style.borderBottom = 'none';
        applicationTabViewButton.style.fontWeight = 'normal';
    } catch (error) {
        
    }
});

postFilter.addEventListener("change", function(event) {
    event.preventDefault();    
    try {
        getPostList();
    } catch (error) {
        
    }
});


//   Application Tab

async function handleViewButtonEvent(event) {
    let volunteerId = event.target.getAttribute('data-volunteerID');
    let postId = event.target.getAttribute('data-postID');
    // console.log(volunteerId);
    // console.log(postId);
    await setCookie('idVolunteer', volunteerId, 1); 
    await setCookie('idPost', postId, 1);

    const pageURL = "organization_applicant_detail.html";
    window.location.href = pageURL;
 }

 async function handleViewButton(event) {
    let volunteerId = event.currentTarget.getAttribute('data-volunteerID');
    let postId = event.currentTarget.getAttribute('data-postID');
    // console.log(volunteerId);
    // console.log(postId);
    await setCookie('idVolunteer', volunteerId, 1); 
    await setCookie('idPost', postId, 1);

    const pageURL = "organization_applicant_detail.html";
    window.location.href = pageURL;
 }

const collectionRef = collection( db, 'application' );

async function getApplicationList() {

    const applicationFilter = document.getElementById("applicationFilter").value;

    document.getElementById("application-list").innerHTML = "";
    const q2 = query(collectionRef, where( "organizationId", "==" , idOrganization ), orderBy("dateApplied", "desc"));

    let applicationArray = [];
    await getDocs(q2, collectionRef)
        .then((snapshot) => {
            console.log(snapshot);
            snapshot.docs.forEach(doc => {
                if((applicationFilter === "New") && (doc.data().status === "applied")) {
                    applicationArray.push(doc.data())
                } else if((applicationFilter === "Accepted") && (doc.data().status === "approved")) {
                    applicationArray.push(doc.data())
                } else if((applicationFilter === "Rejected") && (doc.data().status === "declined")) {
                    applicationArray.push(doc.data())
                } else if((applicationFilter === "All") && (doc.data().status !== "complete")) {
                    applicationArray.push(doc.data())
                }
                

            })
            console.log(applicationArray);
            applicationArray.forEach(event => {    
                
                const div = document.createElement('div');
                const applicationList = document.getElementById("application-list");
                applicationList.appendChild(div);
                div.setAttribute("data-volunteerID", event.volunteerID);
                div.setAttribute("data-postID", event.postsID);
                div.setAttribute("class", "card");
                div.addEventListener('click', handleViewButton); 

                const imgElement = document.createElement('img');
                imgElement.src = '../images/icons/black-left-arrow.svg'; 
                imgElement.width = 20; 
                div.append(imgElement);

                const volunteercolRef = collection( db, 'volunteer' );

                async function getVolunteerDetails() {
                    const dRef = doc(volunteercolRef, event.volunteerID);
                    await getDoc(dRef)
                        .then((snapshot) => {

                            let data = snapshot.data();
                            let status;
                            if(event.status == "applied") {
                                status = "New";
                            } else if (event.status == "approved") {
                                status = "Accepted";
                            } else {
                                status = "Rejected";
                            }

                            const statusDiv = document.createElement('div');
                            statusDiv.setAttribute("class", "statusDiv");
                            statusDiv.innerHTML = `<p>${status}</p>`;
                            div.append(statusDiv);
                            const img = document.createElement('img');
                            if(data.photoLink === undefined) {
                                data.photoLink = '../images/vol_profilepic_dummy.svg';
                            }
                            console.log("link:" +data.photoLink);
                            img.setAttribute("src", data.photoLink);
                            div.append(img);
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

                                        const div_p0 = document.createElement('div');
                                        div.append(div_p0);
                                        const div_p = document.createElement('div');
                                        div_p0.append(div_p);
            
                                        const p5 = document.createElement('p');
                                        p5.innerText = `Submitted On`;
                                        div_p.append(p5);
                                        const p5_1 = document.createElement('p');
                                        p5_1.innerText = `${event.dateApplied.toDate().toLocaleDateString('en-GB')}`;
                                        div_p.append(p5_1);

                                        const div_p1 = document.createElement('div');
                                        div_p0.append(div_p1);
                                        const p4 = document.createElement('p');
                                        p4.innerText = `Post Expiry`;
                                        div_p1.append(p4);
                                        const p4_1 = document.createElement('p');
                                        p4_1.innerText = `${data.expireDate.toDate().toLocaleDateString('en-GB')}`;
                                        div_p1.append(p4_1);
            
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
    try { 
        await getApplicationList();
        applicationTabViewButton.style.borderBottom = '2px solid black';
        applicationTabViewButton.style.fontWeight = '600';
        postTabViewButton.style.borderBottom = 'none';
        postTabViewButton.style.fontWeight = 'normal';

    } catch (error) {
        
    }
});

applicationFilter.addEventListener("change", async function(event) {
    event.preventDefault();    
    try {
        await getApplicationList();
    } catch (error) {
        
    }
});

window.onload = getPostList();
window.onload = getApplicationList();

// SPA Related
const allPages = document.querySelectorAll('div.page');
allPages[0].style.display = 'block';

function navigateToPage(event) {
    let pageId
   
    pageId = location.hash ? location.hash : '#post';
    
    for (let page of allPages) {
        if (pageId === '#' + page.id) {
        page.style.display = 'block';
        } else {
        page.style.display = 'none';
        }
    }
    return;
}
navigateToPage();

//init handler for hash navigation
window.addEventListener('hashchange', navigateToPage);



  


