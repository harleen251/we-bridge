//Function to get the value of a cookie by its name
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
const idOrganization = getCookie("idOrganization");
const idPost = getCookie("idPost");
console.log(idPost);

import { getFirestore, collection, getDoc ,doc , getDocs,
    query , where, orderBy
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";


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

const colRef = collection( db, 'posts' );

const docRef = doc(colRef, idPost);

    let data =[]
    getDoc(docRef)
        .then((snapshot) => {
            data = snapshot.data();
            console.log("Document data:", data);
            let post_info = document.getElementById("Post_info")
            post_info.innerHTML = `<h1>${data.positionTitle}</h1>
            <p>${data.description}</p>`
        
            const date = data.date.toDate();
            const p = document.createElement('p');
            p.innerText = date.toLocaleDateString();
            post_info.append(p);

            const hours = date.getHours().toString().padStart(2, '0');
            let period;

            if (hours >= 0 && hours < 12) {
                period = "AM";
            }  else {
                period = "PM";
            }
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const p1 = document.createElement('p');
            p1.innerText = `${hours}:${minutes} ${period}`;
            post_info.append(p1);

            const p2 = document.createElement('p');
            p2.innerText = `${data.location}`;
            post_info.append(p2);
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });



const applicationRef = collection( db, 'application' );
const q = query(applicationRef, where( "postsID", "==" , idPost ), where( "status", "==" , "approved" ));
let approvedList = [];
    getDocs(q, applicationRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                approvedList.push(doc.data());
            console.log(approvedList);
                
            });
            approvedList.forEach((event) => {
                const volunteerRef = collection( db, 'volunteer' );
                const docRef = doc(volunteerRef, event.volunteerID);
                let data
                getDoc(docRef)
                .then((snapshot) => {
                    data = snapshot.data();
                    console.log("Document data:", data);
                    let checkInDate = "";
                    let checkInTime = "";
                    let checkOutDate = "";
                    let checkOutTime = "";

                    async function getVolunteerRecord() {
                        const volunteerRecordRef = collection( db, 'volunteerRecord' );
                        const q = query(volunteerRecordRef, where( "postsID", "==" , idPost ), where( "volunteerID", "==" , event.volunteerID ));
                        let record = [];
                        await getDocs(q, volunteerRecordRef)
                            .then((docs) => {
                                docs.forEach((doc) => {
                                    record = doc.data();
                                    console.log("Record data:", record);
                                   
                                });
                            })
                            .catch((error) => {
                            console.error("Error getting document:", error);
                            });


                        checkInDate = record.checkInDate?record.checkInDate.toDate().toLocaleDateString():"DD/MM/YY"; 
                        checkInTime = record.checkInDate?
                        record.checkInDate.toDate().getHours().toString().padStart(2, '0')+":"+record.checkInDate.toDate().getMinutes().toString().padStart(2, '0'):"00:00"; 
                        checkOutDate = record.checkOutDate?record.checkOutDate.toDate().toLocaleDateString():"DD/MM/YY"; 
                        checkOutTime = record.checkOutDate?
                        record.checkOutDate.toDate().getHours().toString().padStart(2, '0')+":"+record.checkOutDate.toDate().getMinutes().toString().padStart(2, '0'):"00:00"; 
                        let hours = record.hours?record.hours:"0";
                        let row = `<tr>
                                    <td><img src=${data.photoLink} width="150">
                                    ${data.firstName}</td>
                                    <td><p>${checkInDate}</p><p>${checkInTime}</p></td>
                                    <td><p>${checkOutDate}</p><p>${checkOutTime}</p></td>
                                    <td>${hours}</td>
                                    </tr>`;

                        tbody.innerHTML += row

                    }
                    getVolunteerRecord()
                

                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                });

            })
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });

