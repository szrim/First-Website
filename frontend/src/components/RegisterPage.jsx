import React, {useState} from 'react';

function RegisterPage({onInputChange, onValidForm, onPasswordMatch, onIsEmailvalid, onIsUsernameValid, onIsPasswordStrong, onHandleRegister}){

  const [togglePassword, setTogglePassword] = useState(false);

  const handleTogglePassword = () => {
    setTogglePassword((prev) => !prev)
  };

  return (
    <>
    <div>
      <h1> Register</h1>
      <br />
      <form onSubmit={onHandleRegister}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" onChange={onInputChange}/>
        <span>{onIsEmailvalid}</span>
        <br />
        <label htmlFor="usernameInp">Username</label>
        <input type="text" name="username" id="usernameInp" onChange={onInputChange} />
        <div>
          <span id="usernameFeedback">{onIsUsernameValid}</span>
        </div>
        <br />
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input type={togglePassword ? 'text' : 'password'} name="password" onChange={onInputChange} />
          <button type="button" onClick={handleTogglePassword}> {togglePassword ? 'Hide' : ' Show'} Password</button>
        </div>
        <div id="passwordStrength" className="password-strength">
          <span id="passwordStrengthText">{onIsPasswordStrong}</span>
        </div>
        <br />
        <label htmlFor="cPassword">Confirm Password</label>
        <input type="password" name="cPassword"/>
        <div className="password-match" style={{color: onPasswordMatch ? 'green' : 'red'}}> Passwords match: {onPasswordMatch ? 'Yes' : 'No'} </div>
        <button type="submit" disabled={!onValidForm}>Register</button>
      </form>
    </div>
    </>
  )
};

export default RegisterPage;