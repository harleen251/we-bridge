let qrcodeInstance = null; // Store the current QR code instance

document.getElementById('checkInBtn').addEventListener('click', function() {
    generateQRCode('checkIn');
});

document.getElementById('checkOutBtn').addEventListener('click', function() {
    generateQRCode('checkOut');
});

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

