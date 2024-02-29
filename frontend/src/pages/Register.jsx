import React, { useEffect, useState } from 'react';
import '../styles/register.css';

function Register(){

  const [ formData, setFormData ] = useState({
    email: '',
    username: '',
    password: ''
  });

  const [ togglePassword, setTogglePassword ] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  };

  const handleTogglePassword = () => {
    setTogglePassword((prevToggle) => !prevToggle)
  };

  return (
    <>
    <div>
      <h1> Register</h1>
      <br />
      <form onSubmit={handleRegister}>
        <label for="email">Email</label>
        <input type="email" name="email" onChange={handleInputs}/>
        <br />
        <label for="usernameInp">Username</label>
        <input type="text" name="username" onChange={handleInputs} />
        <div>
          <span id="usernameFeedback"></span>
        </div>
        <br />
        <label for="password">Password</label>
        <div class="password-input">
          <input type={togglePassword ? 'text' : 'password'} name="password" onChange={handleInputs} />
          <button type="button" onClick={handleTogglePassword}> {togglePassword ? 'Hide' : ' Show'} Password</button>
        </div>
        <div id="passwordStrength" class="password-strength">
          Password Strength: <span id="passwordStrengthText"></span>
        </div>
        <br />
        <label for="cPassword">Confirm Password</label>
        <input type="password" name="cPassword" id="cPassword" />
        <div id="passwordMatch" class="password-match">Passwords match: <span id="passwordMatchText"></span></div>
        <button type="submit" id="registerBtn" disabled>Register</button>
      </form>
    </div>
    </>
  )
};

export default Register;