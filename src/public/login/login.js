document.addEventListener('DOMContentLoaded', () => {
  const togglePasswordBtn = document.getElementById('togglePassword');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');

  // Function to check if the inputs are empty and enable/disable the login button accordingly
  function checkInputs() {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    loginBtn.disabled = emailValue === '' || passwordValue === '';
  }

  // Add event listeners to the input fields
  emailInput.addEventListener('input', checkInputs);
  passwordInput.addEventListener('input', checkInputs);

  // Initially check inputs on page load
  checkInputs();

  togglePasswordBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordBtn.textContent = 'Hide';
    } else {
      passwordInput.type = 'password';
      togglePasswordBtn.textContent = 'Show';
    }
  });
});
