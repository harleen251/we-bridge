import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDoc ,doc , getDocs, updateDoc, addDoc, 
    query , where, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getCookie } from "./backend.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
  authDomain: "webridge-81f09.firebaseapp.com",
  projectId: "webridge-81f09",
  storageBucket: "webridge-81f09.appspot.com",
  messagingSenderId: "950961168294",
  appId: "1:950961168294:web:1cc48025ccfb341ea93967",
  measurementId: "G-VWM7GNP66X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(); 

let volunteerIdValue = "";
let postIdValue = "";
async function getTheCookieForVolunteerId() {
    const cookieValue = await getCookie("volunteerId");
    
    if (cookieValue !== null && cookieValue !== "") {
        volunteerIdValue = cookieValue;
        console.log("volunteerIdValue", volunteerIdValue);
    }

    return volunteerIdValue;
}


async function getTheCookieForPostId() {
    const cookieValue = await getCookie("vol_postId");
    
    if (cookieValue !== null && cookieValue !== "") {
        postIdValue = cookieValue;
    }

    return postIdValue;
}

let checkInStatus;
async function getTheCookieForCheckInCheckOut() {
    const cookieValue = await getCookie("checkedIn");
    
    if (cookieValue !== null && cookieValue !== "") {
        checkInStatus = cookieValue;
    }

    return checkInStatus;
}


const scanner = new Html5QrcodeScanner('reader', {
    qrbox: {
    width: 250,
    height: 250,
    },
    fps: 20,
    });
     await scanner.render(successForCheckin, error);
    
    function error(err) {
    console.error(err);
    }

    let volunteerIdFromCookie = await getTheCookieForVolunteerId();
    console.log("volunteerIdFromCookie", volunteerIdFromCookie);
    let postIdFromCookie =  await getTheCookieForPostId();
    console.log("postIdFromCookie", postIdFromCookie);
    let checkInStatusValue = await getTheCookieForCheckInCheckOut();
    console.log("checkInStatusValue", checkInStatusValue);

    async function extractPostId(decodedText) {
        console.log(decodedText);
    const checkInSuccessfulIndex = decodedText.indexOf("Check-In Successful");

    if (checkInSuccessfulIndex !== -1) {
        const postIdMatch = decodedText.match(/Post:\s*([^\s]+)/);
        console.log("postIdMatch", postIdMatch);
        if (postIdMatch && postIdMatch[1]) {
            const postId = postIdMatch[1];
            return { checkInSuccessful: true, postId: postId };
        } else {
            console.error("Post ID not found in the decoded text.");
            return { checkInSuccessful: false, postId: null };
        }
    } else {
        console.error("Check-In Successful not found in the decoded text.");
        return { checkInSuccessful: false, postId: null };
    }

    }

    async function extractPostIdForCheckout(decodedText){
    const workCompletedIndex = decodedText.indexOf("Work Completed");

    if (workCompletedIndex !== -1) {
        const postIdMatch = decodedText.match(/Post:\s*([^\s]+)/);

        if (postIdMatch && postIdMatch[1]===postIdFromCookie) {
            const postId = postIdMatch[1];
            
            return { workCompleted: true, postId: postId };
        } else {
            console.error("Post ID not found in the decoded text.");
            return { workCompleted: false, postId: null };
        }
    } else {
        console.error("Work Completed not found in the decoded text.");
        return { workCompleted: false, postId: null };
    }
    }
    const applicationRef = collection( db, 'application');


     async function successForCheckin(decodedText) {
        console.log("decoded text is",decodedText);
        
        let applicationStatus = " ";

        const q = query(applicationRef, where("volunteerID", "==", volunteerIdFromCookie), where("postsID", "==", postIdFromCookie));
        await getDocs(q, applicationRef)
            .then((snapshot) => {
                snapshot.forEach((document) => {
                    applicationStatus = document.data().status;
                })
            })
        if (applicationStatus === "approved") {
            if (checkInStatusValue == "true") {
                const { checkInSuccessful, postId } = await extractPostId(decodedText);
                if (checkInSuccessful) {
                var checkInDate = new Date();

                try {
                    const colRef = collection(db, 'volunteerRecord');
    
                    await addDoc(colRef, {
                        // Store the scanned QR code data
                        checkInDate: checkInDate, 
                        volunteerID: volunteerIdFromCookie,
                        postsID: postIdFromCookie
                    });
            
    
                    // window.location.href = "volunteer_account.html#commitment";
                    // submitPost.reset();
                } catch (error) {
                    console.error("Error adding document: ", error);
                    alert("An error occurred while submitting the post.");
                }
            }
            else if (!checkInSuccessful) {
                alert('Invalid QR code');
            }
        }
            else {
                console.log("here");
                const { workCompleted, postId } = await extractPostIdForCheckout(decodedText);
                if (workCompleted) {
                await updateStatusInApplicationCollection();
                    
                const dataRef = collection(db, 'volunteerRecord');
                const q = query(dataRef, where("volunteerID", "==", volunteerIdFromCookie), where("postsID", "==", postIdFromCookie));
                
                await getDocs(q,dataRef)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((document) => {
                        console.log("document", document);
                        const documentRef = doc(dataRef, document.id);
                        console.log("document.id", document.id);
                        let checkInTime = document.data().checkInDate.seconds;
                        console.log("checkintime", checkInTime);
                        let checkOutTime = new Date();
                        console.log("checkouttime", checkOutTime);
    
                        const dataToUpdate = {
                            checkOutDate: checkOutTime,
                            hours: calculateHours(checkInTime, checkOutTime)
                        };
    
                         updateDoc(documentRef, dataToUpdate)
                            .then(() => {
                            console.log('Document field updated successfully.');
                            })
                            .then(() =>{
                            window.location.href = "volunteer_record.html";

                            })
                            .catch((error) => {
                            console.error('Error updating document field:', error);
                            alert("An error occurred while submitting the post.");
                            });
                        });
                    })
                    .catch((error) => {
                        console.error("Error querying for documents:", error);
                    });
                }
                else {
                    alert('Invalid QR Code');
                }
    
            }
        }
        
            
            scanner.clear();
            document.getElementById('reader').remove();
        }

         function calculateHours(checkInTime, checkOutTime) {
            const timeDifferenceInSeconds = (checkOutTime/1000) - checkInTime;
            const timeDifferenceInHours = timeDifferenceInSeconds / 3600;
            const roundedHoursDifference = timeDifferenceInHours.toFixed(2); // Round to 2 decimal places
            console.log(parseFloat(roundedHoursDifference));
            return parseFloat(roundedHoursDifference);

        }

        async function updateStatusInApplicationCollection(){
            const q = query(applicationRef, where( "volunteerID", "==" , volunteerIdFromCookie ), where( "postsID", "==" , postIdFromCookie ));

                    await getDocs(q,applicationRef)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((document) => {
                        const documentRef = doc(applicationRef, document.id);
                
                        const dataToUpdate = {
                            status: "complete"
                        };
                
                        updateDoc(documentRef, dataToUpdate)
                            .then(() => {
                            console.log('Document field status updated to complete successfully.');
                            })
                            .catch((error) => {
                            console.error('Error updating document field status:', error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.error("Error querying for documents for application collection:", error);
                    });
        }
        const backButton = document.getElementById("back-button");
    if (backButton) {
      backButton.addEventListener("click", function() {
        alert('hi');
        window.location.href = "volunteer_account.html#commitment";
      });
    }
        
    
        
    
      