const organizationId = "hNEr10bBz2HUA0QlKkV0";

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

// init services
const db = getFirestore();

const colRef = collection( db, 'organization' );

const docRef = doc(colRef, organizationId);

let data =[]
getDoc(docRef)
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


const postsRef = collection(db, 'posts');

const q = query(postsRef, where( "organizationID", "==" , organizationId ));

const currentDate = new Date();

getDocs(q, postsRef)
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

            const q = query(applicationRef, where("postsID", "==", postId));

            let countApproved = 0;
            let applicantsArray = []
            getDocs(q, applicationRef)
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
                    manageButton.innerHTML = 'Manage Activity';
                    div.append(manageButton);
                })
                .catch(err => {
                    console.log(err.message)
                })
        })

  })
  .catch((error) => {
        console.error("Error getting posts:", error);
  });


//   Application Tab

const collectionRef = collection( db, 'application' );

const q2 = query(collectionRef, where( "organizationID", "==" , organizationId ));

let applicationArray = [];
getDocs(q2, collectionRef)
    .then((snapshot) => {
        // console.log(snapshot);
        snapshot.docs.forEach(doc => {
        applicationArray.push(doc.data())
        })
        console.log(applicationArray);
        applicationArray.forEach(event => {    
            
            const div = document.createElement('div');
            const applicationList = document.getElementById("application-list");
            applicationList.appendChild(div);

            const volunteercolRef = collection( db, 'volunteer' );

            const dRef = doc(volunteercolRef, event.volunteerID);
            getDoc(dRef)
                .then((snapshot) => {
                    data = snapshot.data();
                    const h3tag = document.createElement('h3');
                    h3tag.innerText = `${data.firstName} ${data.lastName}`;
                    div.append(h3tag);

                    const docsRef = doc(postsRef, event.postsID);
                    getDoc(docsRef)
                        .then((snapshot) => {
                            data = snapshot.data();
                            const p3 = document.createElement('p');
                            p3.innerText = data.positionTitle;
                            div.append(p3);

                            const p5 = document.createElement('p');
                            p5.innerText = `Submitted On: ${event.dateApplied.toDate().toLocaleDateString()}`;
                            div.append(p5);

                            const p4 = document.createElement('p');
                            p4.innerText = `Post Expire On: ${data.expireDate.toDate().toLocaleDateString()}`;
                            div.append(p4);

                            const viewButton = document.createElement('button');
                            viewButton.innerHTML = 'View';
                            div.append(viewButton);
                        })
                        .catch(err => {
                            console.log(err.message)
                        })
                })
                .catch(err => {
                    console.log(err.message)
                })

        });
    })
    .catch(err => {
        console.log(err.message)
    })




















