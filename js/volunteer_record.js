import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs,getDoc, onSnapshot, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js';
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

const BASE_URI = "http://localhost:3000/";
const SHARE_URI = BASE_URI + "share";
const USERINFO_URI = BASE_URI + "userinfo";
const GET_AUTH_URI = BASE_URI + "getAuthUri";
const UPLOAD_FILE_URI = BASE_URI + "uploadFile";
const EXPORT_URI = BASE_URI + "export";

const MAX_NB_RETRY = 20;
const RETRY_DELAY_MS = 3000;

const volunteerId = await getCookie("volunteerId");
// const volunteerId = "kdF4ksCgCLBhKcL6gRaJ"

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function generateAndDownloadPDF(htmlContent,outputPath) {  
  const options = {
    filename: outputPath,
    margin: 1,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };

  // Use html2pdf to generate PDF
  html2pdf().set(options).from(htmlContent).save();
}

document.getElementById('btnDownload').addEventListener("click", async function (event) {
  event.preventDefault();
  const htmlContent = document.documentElement;
  //const htmlContent = document.querySelector('#data-table');
  generateAndDownloadPDF(htmlContent, "my-record.pdf");
  await shareAsImage();
});
document.getElementById('btnDownloadMobile').addEventListener("click", async function (event) {
  event.preventDefault();
  const htmlContent = document.documentElement;
  //const htmlContent = document.querySelector('#data-table');
  generateAndDownloadPDF(htmlContent, "my-record.pdf");
  await shareAsImage();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getLinkedinAuth() {
  let ret = false;

  /**
   * Attempt to get the user's info first. If we can't get it then
   * it means authentication is required
   */
  let userInfoRes = await fetch("http://localhost:3000/userinfo", {
    method: "GET",
  });
  let resData = await userInfoRes.json();
  
  if (resData.error) {
    /* First get the actual Linkedin auth URI and prompt a new tab */
    const getAuthUriRes = await fetch("http://localhost:3000/getAuthUri", {
      method: "GET",
    });
    resData = await getAuthUriRes.json();
    window.open(resData.authUri, "_blank");
  }

  let retryLeft = MAX_NB_RETRY;
  while (retryLeft) {
    userInfoRes = await fetch("http://localhost:3000/userinfo", {
      method: "GET",
    });
    resData = await userInfoRes.json();
    if (resData.error) {
      await sleep(RETRY_DELAY_MS);
      retryLeft -= 1;
    } else {
      ret = true;
      break;
    }
  }

  if (!ret) {
    console.log(`Linkedin auth attempt timed out`);
  }

  return ret;
}

async function uploadLinkedinFile() {
  let ret = true;
  const postData = { fileName: "output.png" };
  const response = await fetch("http://localhost:3000/uploadFile", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData), // body data type must match "Content-Type" header
  });

  let resData = await response.json();
  if (resData.error) {
    console.log(`Failed to upload Linked file`);
    ret = false;
  }

  return ret;
}

async function shareLinkedinPost() {
  const postData = { shareData: document.getElementById("shareData").value };
  const response = await fetch("http://localhost:3000/share", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData), // body data type must match "Content-Type" header
  });

  let resData = await response.json();
  console.log(resData);
  document.getElementById("shareData").value = "";
}

async function shareAsImage() {
    const elementToCapture = document.documentElement;
    //const elementToCapture = document.getElementById('contentToShare');    

    // Capture image with html2canvas
    const canvas = await html2canvas(elementToCapture);
    
    // Convert the canvas to a data URL
    const imageDataUrl = canvas.toDataURL('image/png');
    try {
      //Send the image data to the server
      const uploadResponse = await fetch('http://localhost:3000/uploadImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageDataUrl }),
      })
      .then(response => response.text())
      .then(data => {      
       console.log(data);
      })
      .catch(error => console.error('Error:', error));      
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } 
    
}

// Call the function when needed, for example, on a button click
document.getElementById('btnShare').addEventListener('click', async function (event){
  event.preventDefault();
  //await handleExport();
 
  await handleLinkedinShare(); 

});

document.getElementById('btnShareMobile').addEventListener('click', async function (event){
  event.preventDefault();
  //await handleExport();
 
  await handleLinkedinShare(); 

});



async function handleLinkedinShare() {
  let oathSuccess = await getLinkedinAuth();
  if (oathSuccess && (await uploadLinkedinFile())) {
    await shareLinkedinPost();
  } else {
    console.log(`Failed to share to Linkedin`);
  }
}

async function handleExport() {
  const postData = { exportData: "Share from WeBridge" };
  const response = await fetch(EXPORT_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData), // body data type must match "Content-Type" header
  });

  let resData = await response.json();
  console.log(resData);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
      const orgDetails = await getOrganizationDetails(postDetails.organizationId);
  
      return new VolunteerEntry(postVolunteerHours, orgDetails.orgName, postDetails.positionTitle, date);
    });
  
    // Wait for all promises to complete and populate volunteerEntryArray
    volunteerEntryArray = await Promise.all(recordPromises);
  }
  async function getPostDetails(postId) {
    console.log("postId", postId);
    const postRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
        console.log(docSnap.data().organizationId);
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
      const circle = document.querySelector(".volunteer-hours");
      const totalHoursVolunteered = volunteerEntryArray.reduce((total, entry) => total + entry.hours, 0);

      // const formattedTotalHours = totalHoursVolunteered.toFixed(2);
      const text = `${totalHoursVolunteered}`;
      console.log("totalHoursVolunteered", totalHoursVolunteered  );
      circle.textContent = text;
      const table = document.getElementById("data-table");

    // Function to create a checkbox input element
    function createCheckbox() {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "checkboxes";
      return checkbox;
    }

    // Create a "Select All" checkbox in the table header
    // const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    // selectAllCheckbox.addEventListener("click", function () {
    //   const checkboxes = table.querySelectorAll("input[type='checkbox']");
    //   checkboxes.forEach((checkbox) => {
    //     checkbox.checked = this.checked;
    //   });
    // });

// Function to sort data based on the date
function sortDataByDate(data, newestFirst) {
    return data.slice().sort((a, b) => {
      const dateA = new Date(parseDate(a.date));
      const dateB = new Date(parseDate(b.date));
      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  }
  // function parseDate(dateString) {
  //   const [day, month, year] = dateString.split("/");
  //   // Construct a new date string in the "YYYY-MM-DD" format
  //   return `${year}-${month}-${day}`;
  // }
  
  // Handle the sort dropdown change event
  document.getElementById("sortOrder").addEventListener("change", () => {
    const sortOrder = document.getElementById("sortOrder").value;
    const isSortingNewestFirst = sortOrder === "newest";
    const sortedData = sortDataByDate(volunteerEntryArray, isSortingNewestFirst);
    // populateTable(sortedData);
    populateGridTable(sortedData);

  });
  
  // Initialize the table with sorted data (newest first by default)
  const initialSortedData = sortDataByDate(volunteerEntryArray, true);
  // populateTable(initialSortedData);
  populateGridTable(initialSortedData);

  function parseDate(dateString) {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
}
  
  function populateTable(data) {
    // Clear the table
    const table = document.getElementById("data-table");
    // let div_mobile = document.getElementById("volunteer-record-mobile");
    const tbody = table.getElementsByTagName("tbody")[0];
    // Clear the existing rows in the tbody
    tbody.innerHTML = "";  
    // Re-create the table with sorted data
    data.forEach((item) => {
      const row = document.createElement("tr");
      const columns = ["positionTitle", "organizationName", "date", "hours"];
  
      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.textContent = item[column];
        cell.classList.add("cell", column);
        row.appendChild(cell);
        // div_mobile.appendChild()
      });
  
      // const checkboxCell = document.createElement("td");
      // const checkbox = createCheckbox();
      // checkboxCell.appendChild(checkbox);
      // row.appendChild(checkboxCell);
  
      tbody.appendChild(row);
      
    });
  }

  function populateGridTable(data) {
    // Clear the table
    const table = document.getElementById("data-table");
    const tbody = table.getElementsByTagName("tbody")[0];
    // Clear the existing rows in the tbody
    tbody.innerHTML = "";  
    // Create the header row
    // const outerDiv = document.createElement('div');
    // outerDiv.className = "outer-div";
    const headerRow = document.createElement("div");
    headerRow.classList.add("grid-container", "header-row");

    const columns = ["Position Title", "Organization Name", "Date", "Hours"];

    columns.forEach((column) => {
        const headerCell = document.createElement("div");
        headerCell.textContent = column;
        headerCell.classList.add("header-cell");
        headerRow.appendChild(headerCell);
    });
  //   columns.forEach((column) => {
  //     const headerCell = document.createElement("div");
  //     headerCell.textContent = column;
  //     headerCell.classList.add("header-cell-mobile", column.replace(/\s+/g, '-').toLowerCase()); // Convert spaces to hyphens and convert to lowercase
  //     headerRow.appendChild(headerCell);
  // });

    tbody.appendChild(headerRow);

    // Re-create the table with sorted data
    data.forEach((item) => {
        const gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container-two");

        const columns = ["positionTitle", "organizationName", "date", "hours"];
        let iterator = 1;
        columns.forEach((column) => {
            if (iterator===2) {
              const commonOrganizationName = document.createElement("div");
              commonOrganizationName.textContent = "Organization";
              commonOrganizationName.classList.add("cell-two", "common-organization", "common");
              gridContainer.appendChild(commonOrganizationName);
            } else if(iterator===3){
              const commonDate = document.createElement("div");
              commonDate.textContent = "Date";
              commonDate.classList.add("cell-two", "common-date", "common");
              gridContainer.appendChild(commonDate);
            } else if(iterator ===4){
              const commonHours = document.createElement("div");
              commonHours.textContent = "Hours";
              commonHours.classList.add("cell-two", "common-hours", "common");
              gridContainer.appendChild(commonHours);
            }
            const cell = document.createElement("div");
            cell.textContent = item[column];
            cell.classList.add("cell-two", column, "data-row");
            gridContainer.appendChild(cell);
            iterator++;

        });

        tbody.appendChild(gridContainer);
    });
    // outerDiv.appendChild(tbody);
}

  // function populateTable(data) {
  //   // Clear the table
  //   const table = document.getElementById("data-table");
  //   const tbody = table.getElementsByTagName("tbody")[0];
  //   // Clear the existing rows in the tbody
  //   tbody.innerHTML = "";  
  
  //   // Re-create the table with sorted data
  //   data.forEach((item) => {
  //     // Create a row for positionTitle and checkbox
  //     const titleRow = document.createElement("tr");
  
      
  
  //     // Create positionTitle cell
  //     const titleCell = document.createElement("td");
  //     titleCell.textContent = item["positionTitle"];
  //     titleCell.className = "position-title-mobile desktop-position-title"
  //     titleRow.appendChild(titleCell);
  //       // // Create checkbox cell
  //       // const checkboxCell = document.createElement("td");
  //       // const checkbox = createCheckbox();
  //       // checkboxCell.appendChild(checkbox);
  //       // titleRow.appendChild(checkboxCell);
  
  //     // Append the titleRow to tbody
  //     tbody.appendChild(titleRow);
  
  //     // Create a row for date, organizationName, and hours
  //     const detailsRow = document.createElement("tr");
  
  //     // Create data name cells
  //     const orgNameLabelCell = document.createElement("td");
  //     orgNameLabelCell.textContent = "Organization";
  //     orgNameLabelCell.className = "mobile-view"

  //     detailsRow.appendChild(orgNameLabelCell);
  
  //     const dateLabelCell = document.createElement("td");
  //     dateLabelCell.textContent = "Date";
  //     dateLabelCell.className = "mobile-view";

  //     detailsRow.appendChild(dateLabelCell);
  
  //     const hoursLabelCell = document.createElement("td");
  //     hoursLabelCell.textContent = "Hours";
  //     hoursLabelCell.className = "mobile-view"
  //     detailsRow.appendChild(hoursLabelCell);
  
  //     // Create data cells
  //     const orgCell = document.createElement("td");
  //     orgCell.textContent = item["organizationName"];
  //     orgCell.className = "desktop-organization"
  //     detailsRow.appendChild(orgCell); 
  
  //     const dateCell = document.createElement("td");
  //     dateCell.textContent = item["date"];
  //     dateCell.className = "desktop-date";
  //     detailsRow.appendChild(dateCell);
  
  //     const hoursCell = document.createElement("td");
  //     hoursCell.textContent = item["hours"];
  //     hoursCell.className = "desktop-hours"
  //     detailsRow.appendChild(hoursCell);
    
  
  //     // Append the detailsRow to tbody
  //     tbody.appendChild(detailsRow);
  //   });
  // }
  
  
    } catch (error) {
      console.error(error);
    }
  })();
