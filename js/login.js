let form = document.getElementById("loginForm");
let username = document.getElementById("username");
let password = document.getElementById("password");
let userError = document.getElementById("userError");
let passError = document.getElementById("passError");
let successMessage = document.getElementById("successMessage");

/*rejex part*/
let usernameRegex = /^[A-Z][a-zA-Z0-9]*[0-9][a-zA-Z0-9]*$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9]).{6,}$/;

/*user and password checks*/
function checkUsername(){
    if(username.value === ""){
        userError.innerHTML = "Username is required";
        userError.className = "error";
        return false;
    }

    else if(!usernameRegex.test(username.value)){
        userError.innerHTML =
        "Username must start with a capital letter and contain a number";
        userError.className = "error";
        return false;
    }

    else{
        userError.innerHTML = "Valid Username";
        userError.className = "success";
        return true;
    }
}
function checkPassword(){
    if(password.value === ""){
        passError.innerHTML = "Password is required";
        passError.className = "error";
        return false;
    }

    else if(!passwordRegex.test(password.value)){
        passError.innerHTML =
        "Password must contain letters and numbers";
        passError.className = "error";
        return false;
    }

    else{
        passError.innerHTML = "Valid Password";
        passError.className = "success";
        return true;
    }
}


username.addEventListener("input", function(){
    checkUsername();
});


password.addEventListener("input", function(){
    checkPassword();
});
function closeModal(){
    document.getElementById("successModal").style.display = "none";
    window.location.href = "../index.html";
}

/*submit part*/
if(form){
    form.addEventListener("submit", function(e){
        e.preventDefault();
        let usernameValid = checkUsername();
        let passwordValid = checkPassword();
        if(usernameValid && passwordValid){
            document.getElementById("successModal").style.display = "flex";
        }
    });
}
