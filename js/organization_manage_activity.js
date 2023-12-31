
import { getFirestore, collection, getDoc ,doc , getDocs,
    query , where, Timestamp
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getCookie } from "./backend.js";

//  Retrieve the user's ID from the cookie
const idOrganization = await getCookie("idOrganization");
const idPost = await getCookie("idPost");
console.log(idPost);


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

const organizationRef = collection(db, 'organization');
const orgDocRef = doc(organizationRef, idOrganization);

let org_info = [];
async function orgInfo() {
    await getDoc(orgDocRef)
            .then((docu) => {
                    org_info = docu.data();
                    console.log(org_info);
                    postInfo();     
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
}

window.onload = orgInfo();

async function postInfo() {
    let data =[]
    await getDoc(docRef)
        .then((snapshot) => {
            data = snapshot.data();
            console.log("Document data:", data);

            let post_info = document.getElementById("Post_info")
            post_info.innerHTML = `<div>
                                    <img id="profile_img" src = "${org_info.photoLink}" >
                                    </div>
                                    <div>
                                    <h1>${data.positionTitle}</h1>
                                    <p id="description">${data.description}</p>
                                    <div id="wrap_data"></div>
                                    </div>`
            let wrap_data = document.getElementById("wrap_data")
            const date = data.date.toDate();

            const div_data_wrap = document.createElement('div');
            wrap_data.append(div_data_wrap);
            const img = document.createElement('img');
            img.setAttribute("src", "../images/icons/date.svg")
            div_data_wrap.append(img);
            const p = document.createElement('p');
            p.innerText = date.toLocaleDateString('en-GB');
            div_data_wrap.append(p);

            const hours = date.getHours().toString().padStart(2, '0');
            let period;

            if (hours >= 0 && hours < 12) {
                period = "AM";
            }  else {
                period = "PM";
            }
            const minutes = date.getMinutes().toString().padStart(2, '0');

            const div_data_wrap1 = document.createElement('div');
            wrap_data.append(div_data_wrap1);
            const img1 = document.createElement('img');
            img1.setAttribute("src", "../images/icons/time.svg")
            div_data_wrap1.append(img1);
            const p1 = document.createElement('p');
            p1.innerText = `${hours}:${minutes} ${period}`;
            div_data_wrap1.append(p1);

            const div_data_wrap2 = document.createElement('div');
            wrap_data.append(div_data_wrap2);
            const img2 = document.createElement('img');
            img2.setAttribute("src", "../images/icons/location.svg")
            div_data_wrap2.append(img2);
            const p2 = document.createElement('p');
            p2.innerText = `${data.location}`;
            div_data_wrap2.append(p2);
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
}

   

const applicationRef = collection( db, 'application' );

async function getVolunteerList() {
    const q = query(applicationRef, where( "postsID", "==" , idPost ), where("status",  "in", ["approved", "complete"]));
    let approvedList = [];
        await getDocs(q, applicationRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    approvedList.push(doc.data());
                console.log(approvedList);
                    
                });

                if(approvedList.length > 0 ) {
                    document.getElementById("volunteerTracking").style.display = "block";
                }

                approvedList.forEach((event) => {
                    const volunteerRef = collection( db, 'volunteer' );

                    async function getVolunteerInfo() {
                        const docRef = doc(volunteerRef, event.volunteerID);
                        let data
                        await getDoc(docRef)
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
        
                                checkInDate = record.checkInDate?record.checkInDate.toDate().toLocaleDateString('en-GB'):"DD/MM/YYYY"; 
                                checkInTime = record.checkInDate?
                                record.checkInDate.toDate().getHours().toString().padStart(2, '0')+":"+record.checkInDate.toDate().getMinutes().toString().padStart(2, '0'):"00:00"; 
                                checkOutDate = record.checkOutDate?record.checkOutDate.toDate().toLocaleDateString('en-GB'):"DD/MM/YYYY"; 
                                checkOutTime = record.checkOutDate?
                                record.checkOutDate.toDate().getHours().toString().padStart(2, '0')+":"+record.checkOutDate.toDate().getMinutes().toString().padStart(2, '0'):"00:00"; 
                                let hours = record.hours?record.hours:"0";
                                let row = `<tr>
                                            <td><img class="vol_profile" src=${data.photoLink} width="100">
                                            <p>${data.firstName}</p></td>
                                            <td><p>${checkInDate}</p><p>${checkInTime}</p></td>
                                            <td><p>${checkOutDate}</p><p>${checkOutTime}</p></td>
                                            <td>${hours}</td>
                                            </tr>`;
        
                                tbody.innerHTML += row;
        
                            }
                            getVolunteerRecord()
                        
                        })
                        .catch((error) => {
                            console.error("Error getting document:", error);
                        });
                    }
                    getVolunteerInfo();
                    
                })
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
}

;(async () => {
    try {
     await getVolunteerList();
    } catch (error) { 
    console.error("Error:",error);
    }
    })();

// QR CODE Related
    let qrcodeInstance = null; // Store the current QR code instance

    document.getElementById('checkInBtn').addEventListener('click', function() {
        generateQRCode('checkIn');
        wrap_qrcode.style.display = "block";
    });
    
    document.getElementById('checkOutBtn').addEventListener('click', function() {
        generateQRCode('checkOut');
        wrap_qrcode.style.display = "block";
    });
    
    function generateQRCode(type) {
    
        const qrcodeContainer = document.getElementById("qrcode");
        if (qrcodeContainer) {
            qrcodeContainer.innerHTML = ''; // Clear the previous QR code
        }
        
        const post = idPost;
        
        const currentTime = new Date();
        const date = Timestamp.fromDate(currentTime);
        console.log(date);
        let text;
    
        if (type === 'checkIn') {
            text = `Check-In Successful\nPost: ${post}\nCheck-In Time: ${date}`;
        } else if (type === 'checkOut') {
            text = `Work Completed, Thank You\nPost: ${post}\nCheck-Out Time: ${date}`;
        }
    
        // Generate a new QR code
        const qrcodeElement = document.getElementById('qrcode');
        qrcodeInstance = new QRCode(qrcodeElement, {
            text: text,
            width: 128,
            height: 128
        });
    }




