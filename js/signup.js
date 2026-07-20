let form = document.getElementById("signupForm");
let fullname = document.getElementById("fullname");
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");

let fullnameError = document.getElementById("fullnameError");
let userError = document.getElementById("userError");
let emailError = document.getElementById("emailError");
let passError = document.getElementById("passError");
let confirmError = document.getElementById("confirmError");

/*regex part*/
let usernameRegex = /^[A-Z][a-zA-Z0-9]*[0-9][a-zA-Z0-9]*$/;
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9]).{6,}$/;

function checkFullname() {
    if (fullname.value.trim() === "") {
        fullnameError.innerHTML = "Full name is required";
        fullnameError.className = "error";
        return false;
    }
    fullnameError.innerHTML = "Looks good";
    fullnameError.className = "success";
    return true;
}

function checkUsername() {
    if (username.value === "") {
        userError.innerHTML = "Username is required";
        userError.className = "error";
        return false;
    }
    if (!usernameRegex.test(username.value)) {
        userError.innerHTML = "Username must start with a capital letter and contain a number";
        userError.className = "error";
        return false;
    }
    userError.innerHTML = "Valid Username";
    userError.className = "success";
    return true;
}

function checkEmail() {
    if (email.value === "") {
        emailError.innerHTML = "Email is required";
        emailError.className = "error";
        return false;
    }
    if (!emailRegex.test(email.value)) {
        emailError.innerHTML = "Please enter a valid email address";
        emailError.className = "error";
        return false;
    }
    emailError.innerHTML = "Valid Email";
    emailError.className = "success";
    return true;
}

function checkPassword() {
    if (password.value === "") {
        passError.innerHTML = "Password is required";
        passError.className = "error";
        return false;
    }
    if (!passwordRegex.test(password.value)) {
        passError.innerHTML = "Password must be at least 6 characters and contain letters and numbers";
        passError.className = "error";
        return false;
    }
    passError.innerHTML = "Valid Password";
    passError.className = "success";
    return true;
}

function checkConfirmPassword() {
    if (confirmPassword.value === "") {
        confirmError.innerHTML = "Please confirm your password";
        confirmError.className = "error";
        return false;
    }
    if (confirmPassword.value !== password.value) {
        confirmError.innerHTML = "Passwords do not match";
        confirmError.className = "error";
        return false;
    }
    confirmError.innerHTML = "Passwords match";
    confirmError.className = "success";
    return true;
}

fullname.addEventListener("input", checkFullname);
username.addEventListener("input", checkUsername);
email.addEventListener("input", checkEmail);
password.addEventListener("input", function () {
    checkPassword();
    if (confirmPassword.value !== "") checkConfirmPassword();
});
confirmPassword.addEventListener("input", checkConfirmPassword);

function closeModal() {
    document.getElementById("successModal").style.display = "none";
    window.location.href = "./login.html";
}

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let fullnameValid = checkFullname();
        let usernameValid = checkUsername();
        let emailValid = checkEmail();
        let passwordValid = checkPassword();
        let confirmValid = checkConfirmPassword();

        if (fullnameValid && usernameValid && emailValid && passwordValid && confirmValid) {
            const users = JSON.parse(localStorage.getItem("medcareUsers") || "{}");
            users[username.value] = {
                fullname: fullname.value.trim(),
                email: email.value.trim(),
                since: new Date().toISOString(),
            };
            localStorage.setItem("medcareUsers", JSON.stringify(users));

            document.getElementById("successModal").style.display = "flex";
        }
    });
}
