
let signUpBtn = document.getElementById("signUpBtn");
let signInBtn = document.getElementById("signInBtn");
let nameField = document.getElementById("nameField");
let Title = document.getElementById("Title");
let nameValue = document.getElementById("nameValue");
let emailValue = document.getElementById("emailValue");
let passValue = document.getElementById("passValue");

signInBtn.onclick = function (event) {


    const myForm = document.getElementById('myForm');

    nameValue.value = '';
    emailValue.value = '';
    passValue.value = '';
  

    if (emailValue.value.trim() === '' && passValue.value.trim() === '') {
    
    event.preventDefault();

    nameField.style.maxHeight = "0";
    Title.innerHTML = "Sign In";
    signUpBtn.classList.add("disable");
    signInBtn.classList.remove("disable");
    
   
    }else {
        if (!signInBtn.classList.contains("disable")) {
            myForm.submit();
          } else {
            event.preventDefault();
          }
        };

    };

signUpBtn.onclick = function (event) {

    const myForm = document.getElementById('myForm');

    emailValue.value = '';
    passValue.value = '';

    if (nameValue.value.trim() === '') {

        event.preventDefault();

        nameField.style.maxHeight = "60px";
        Title.innerHTML = "Sign Up";
        signUpBtn.classList.remove("disable");
        signInBtn.classList.add("disable");

    } else {
        if (!signUpBtn.classList.contains("disable")) {
            myForm.submit();
          } else {
            event.preventDefault();
          }
        };
    };
