var modal = document.getElementById('divLogin');            

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

frmLogin.addEventListener("submit", function (event) {
    e.preventDefault();
});