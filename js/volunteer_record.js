import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs,getDoc, onSnapshot, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getCookie } from "./backend.js"



const firebaseConfig = {
    apiKey: "AIzaSyBiW_sL8eKxcQ7T9xKqQJxxRaIHmizOBoE",
    authDomain: "webridge-81f09.firebaseapp.com",
    projectId: "webridge-81f09",
    storageBucket: "webridge-81f09.appspot.com",
    messagingSenderId: "950961168294",
    appId: "1:950961168294:web:1cc48025ccfb341ea93967",
    measurementId: "G-VWM7GNP66X"
  };



const volunteerId = await getCookie("volunteerId");
// const volunteerId = "kdF4ksCgCLBhKcL6gRaJ"

const app = initializeApp(firebaseConfig);
const db = getFirestore();

let volunteerEntryArray = []

class VolunteerEntry {
    constructor( hours, organizationName, positionTitle, date) {

        //todo add the title and the organization name
      this.hours = hours;
      this.organizationName = organizationName;
      this.positionTitle = positionTitle;
      this.date = date;
    }
  }

const dataRef = collection(db, 'volunteerRecord');

async function getVolunteerRecordDetails() {
    const q = query(dataRef, where("volunteerID", "==", volunteerId));
    const volunteerRecords = await getDocs(q);
  
    // Create an array of promises to fetch related data for each record
    const recordPromises = volunteerRecords.docs.map(async (sdoc) => {
      const postId = sdoc.data().postsID;
      const postVolunteerHours = sdoc.data().hours;
      const timestamp = sdoc.data().checkInDate.toDate();
      const date = timestamp.toLocaleDateString();

      const postDetails = await getPostDetails(postId);
      const orgDetails = await getOrganizationDetails(postDetails.organizationID);
  
      return new VolunteerEntry(postVolunteerHours, orgDetails.orgName, postDetails.positionTitle, date);
    });
  
  
    volunteerEntryArray = await Promise.all(recordPromises);
  }
  async function getPostDetails(postId) {
    const postRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
        console.log(docSnap.data().organizationID);
      return docSnap.data();
    } else {
      return {};
    }
  }
  
  async function getOrganizationDetails(organizationId) {
    const orgDataRef = doc(db, 'organization', organizationId);
    const docSnap = await getDoc(orgDataRef);
    if (docSnap.exists()) {
        console.log(docSnap.data().orgName);
      return docSnap.data();

    } else {
      return {};
    }
  }
  
  (async () => {
    try {
      await getVolunteerRecordDetails();
      const circle = document.getElementById("circle");
      const totalHoursVolunteered = volunteerEntryArray.reduce((total, entry) => total + entry.hours, 0);

      const text = `${totalHoursVolunteered} Hours<br>volunteered`;
      circle.innerHTML = text;
      const table = document.getElementById("data-table");

    // Function to create a checkbox input element
    function createCheckbox() {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      return checkbox;
    }

    // Create a "Select All" checkbox in the table header
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    selectAllCheckbox.addEventListener("click", function () {
      const checkboxes = table.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
    });

// Function to sort data based on the date
function sortDataByDate(data, newestFirst) {
    return data.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  }
  
  // Handle the sort dropdown change event
  document.getElementById("sortOrder").addEventListener("change", () => {
    const sortOrder = document.getElementById("sortOrder").value;
    const isSortingNewestFirst = sortOrder === "newest";
    const sortedData = sortDataByDate(volunteerEntryArray, isSortingNewestFirst);
    populateTable(sortedData);
  });
  
  // Initialize the table with sorted data (newest first by default)
  const initialSortedData = sortDataByDate(volunteerEntryArray, true);
  populateTable(initialSortedData);
  
  function populateTable(data) {
    // Clear the table
    const table = document.getElementById("data-table");
    table.innerHTML = "";
  
    // Re-create the table with sorted data
    data.forEach((item) => {
      const row = document.createElement("tr");
      const columns = ["positionTitle", "organizationName", "date", "hours"];
  
      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.textContent = item[column];
        row.appendChild(cell);
      });
  
      const checkboxCell = document.createElement("td");
      const checkbox = createCheckbox();
      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);
  
      table.appendChild(row);
    });
  }
  
    } catch (error) {
      console.error(error);
    }
  })();
