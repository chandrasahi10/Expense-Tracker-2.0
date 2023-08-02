
let signUpBtn = document.getElementById("signUpBtn");
let signInBtn = document.getElementById("signInBtn");
let nameField = document.getElementById("nameField");
let Title = document.getElementById("Title");
let nameValue = document.getElementById("nameValue");
let emailValue = document.getElementById("emailValue");
let passValue = document.getElementById("passValue");
let formAction = document.getElementById("formAction");

signInBtn.onclick = function (event) {


    const myForm = document.getElementById('myForm');

    if (!signInBtn.classList.contains("disable")) {
            formAction.value = 'signIn'
            myForm.submit();
    } else {
           
           event.preventDefault();
      
            nameValue.value = '';
            emailValue.value = '';
            passValue.value = '';
        
            nameField.style.maxHeight = "0";
            Title.innerHTML = "Sign In";
            signUpBtn.classList.add("disable");
            signInBtn.classList.remove("disable");
      }
    };


signUpBtn.onclick = function (event) {

    const myForm = document.getElementById('myForm');

    if (!signUpBtn.classList.contains("disable")) {
            formAction.value = 'signUp'
            myForm.submit();s
    } else {
          
          event.preventDefault();

          emailValue.value = '';
          passValue.value = '';
  
          nameField.style.maxHeight = "60px";
          Title.innerHTML = "Sign Up";
          signUpBtn.classList.remove("disable");
          signInBtn.classList.add("disable");
           
        }
    };

