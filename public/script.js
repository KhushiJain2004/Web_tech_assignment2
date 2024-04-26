function validateForm(event) {

    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmpassword").value;
    var country = document.getElementById("country").value;


    // Validation for Password
    if (password === "") {
        alert("Please enter a password.");
        isValid = false;
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        isValid = false;
    }

    // Validation for Confirm Password
    if (confirmPassword === "") {
        alert("Please confirm your password.");
        isValid = false;
    } else if (password !== confirmPassword) {
        alert("Passwords do not match.");
        isValid = false;
    }

    // Validation for Country
    if (country === "select") {
        alert("Please select your country of residence.");
        isValid = false;
    }

    if (isValid) {
        alert("Form submitted successfully!");
        document.getElementById("register").submit(); 
    }

    return isValid;
}
