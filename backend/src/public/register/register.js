document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const cPasswordInput = document.getElementById('cPassword');
  const passwordMatchText = document.getElementById('passwordMatchText');
  const passwordStrengthText = document.getElementById('passwordStrengthText');
  const registerBtn = document.getElementById('registerBtn');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordStrength = document.getElementById('passwordStrength');
  const usernameInput = document.getElementById('usernameInp');
  const usernameFeedback = document.getElementById('usernameFeedback');
  
  //checks that password has been confirmed
  function checkPasswordMatch() {
    const password = passwordInput.value;
    const cPassword = cPasswordInput.value;
    const match = password === cPassword;
    passwordMatchText.textContent = match ? 'Yes' : 'No';
    passwordMatchText.style.color = match ? 'green' : 'red';
    return match;
  };

  //checks that password meets criteria
  function checkPasswordStrength() {
    const password = passwordInput.value;
    const isStrong = isStrongPassword(password);
    passwordStrengthText.textContent = isStrong ? 'Strong' : 'Weak';
    passwordStrengthText.style.color = isStrong ? 'green' : 'red';
    return isStrong;
  };

  //checks that username is available and meets criteria
  function handleUsernameInput() {
    const username = usernameInput.value.trim();

    // Check username length
    const minLength = 3; // Change this to your desired minimum length
    const maxLength = 30;
    if (username.length < minLength) {
      usernameFeedback.textContent = `Username must be at least ${minLength} characters long`;
      usernameFeedback.style.color = 'red';
      registerBtn.disabled = true;
      return;
    };

    if(username.length > maxLength){
      usernameFeedback.textContent = `Username must be less then ${maxLength} characters long`;
      usernameFeedback.style.color = 'red'
      registerBtn.disabled = true;
      return;
    };  

    // Check username format using regex
    const regex = /^[a-zA-Z0-9_ ]+$/; // This regex only allows letters, numbers, and underscores
    if (!regex.test(username)) {
      usernameFeedback.textContent = 'Username must only contain letters, numbers, underscores, spaces and must be 3 - 30 characters';
      usernameFeedback.style.color = 'red';
      registerBtn.disabled = true;
      return;
    };

    // Check username availability
    fetch(`/auth/usernameAvailability?username=${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.available) {
          usernameFeedback.textContent = '';
          //usernameFeedback.style.color = 'green';
          registerBtn.disabled = !checkPasswordMatch() || !checkPasswordStrength();
        } else {
          usernameFeedback.textContent = 'Username Taken';
          usernameFeedback.style.color = 'red';
          registerBtn.disabled = true;
        }
      });
  };


  //enables or disables button based off of inputs matching criteria
  function handlePasswordInputs() {
    console.log('handlePasswordInputs called');
    const passwordMatch = checkPasswordMatch();
    const passwordStrong = checkPasswordStrength();
    // Enable the register button only if the username is valid and both password inputs are valid
    registerBtn.disabled = !usernameInput.value.trim() || !passwordMatch || !passwordStrong;
  }

  // Add event listeners to the input fields
  usernameInput.addEventListener('input', handleUsernameInput);

  //when input happens, calls both password function to check strength and match
  [passwordInput, cPasswordInput].forEach(input => {
    input.addEventListener('input', () => {
      console.log('Password input changed');
      handlePasswordInputs();
      handleUsernameInput();
    });
  });

  togglePasswordBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordBtn.textContent = 'Hide';
    } else {
      passwordInput.type = 'password';
      togglePasswordBtn.textContent = 'Show';
    }
  });

  function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };
});