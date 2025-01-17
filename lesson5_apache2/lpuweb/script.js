// Simple JavaScript to handle form submission
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    // Display an alert with the form details
    alert("Thank you for your message, " + name + "!\nWe will respond to you at " + email + ".");
});