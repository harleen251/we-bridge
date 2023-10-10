import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyD6f4RoEIheWsxJZ1PjJmuGS-lyJpVsG08",
    authDomain: "dummy-project-ccaa8.firebaseapp.com",
    projectId: "dummy-project-ccaa8",
    storageBucket: "dummy-project-ccaa8.appspot.com",
    messagingSenderId: "912819853769",
    appId: "1:912819853769:web:9567dca708bd6e9b60b018"
  }

//   init firebase app
  initializeApp(firebaseConfig)

// init services
const db = getFirestore()

const colRef = collection(db, 'event-details')

let events = []


getDocs(colRef)
  .then((snapshot) => {
    snapshot.docs.forEach(doc => {
      events.push({ ...doc.data(), id: doc.id })
    })
    console.log(events)
    let output = document.getElementById('eventDetails');
    events.forEach(event => {      
      const div = document.createElement('div');
      div.innerHTML = `Date: ${event.date} <br> Description: ${event.description} <br> Email: ${event.email} <br> Location: ${event.location} <br> Phone Number:${event.phoneNumber} <br> Position Title: ${event.positionTitle}<br> Post Expiry Date: ${event.postExpiryDate} <br> Preferred Language: ${event.preferredLanguage}<br> Skills: ${event.skills}<br>  Timeframe: ${event.timeFrame}`; 

      // Create an "Apply" button for each event
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
      output.appendChild(div);
      output.appendChild(applyButton);
    });
  })
  .catch(err => {
    console.log(err.message)
  })

  

 
