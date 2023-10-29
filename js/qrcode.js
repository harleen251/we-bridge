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

// Retrieve the users' ID from the cookie
const volunteerId = getCookie("volunteerId");
const organizationId = getCookie("organizationId");
console.log("volunteerId :"+volunteerId);
console.log("organizationId :"+organizationId);


let qrcodeInstance = null; // Store the current QR code instance

document.getElementById('checkInBtn').addEventListener('click', function() {
    generateQRCode('checkIn');
});

document.getElementById('checkOutBtn').addEventListener('click', function() {
    generateQRCode('checkOut');
});

document.getElementById('volunteerName').value = organizationId;

function generateQRCode(type) {

    const qrcodeContainer = document.getElementById("qrcode");
    if (qrcodeContainer) {
        qrcodeContainer.innerHTML = ''; // Clear the previous QR code
    }
    
    const name = document.getElementById('volunteerName').value;
    
    const currentTime = new Date().toLocaleString();
    let text;

    if (type === 'checkIn') {
        text = `Check-In Successful\nName: ${name}\nCheck-In Time: ${currentTime}`;
    } else if (type === 'checkOut') {
        text = `Work Completed, Thank You\nName: ${name}\nCheck-Out Time: ${currentTime}`;
    }

    // Generate a new QR code
    const qrcodeElement = document.getElementById('qrcode');
    qrcodeInstance = new QRCode(qrcodeElement, {
        text: text,
        width: 128,
        height: 128
    });
}

