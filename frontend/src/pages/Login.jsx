import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Login() {

  useEffect(()=>{
    console.log('mounted')
    return () => {
      console.log('unmounted')
    }
  }, [])

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  
  const [togglePassword, setTogglePassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  const isFormDataValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTogglePassword = () => {
    setTogglePassword((prevShowPassword) => !prevShowPassword);
  };


  const handleLogin = async (e) => {

    console.log('handling login form')
    e.preventDefault();

    try {
      console.log('Logging in user')
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log('login successful')
        console.log('redirecting to profile')
        await setLoginStatus({ success: true});
        await navigate('/profile')
        
        console.log('redirection complete')
      } else {
        console.log('Login unsuccessful')
        setLoginStatus({ success: false });
      }
    } catch (err) {
      console.error('Error during login:', err);
      setLoginStatus({ success: false });
    }
  };


  return (
    <>
    {/* <Link to='/'>Home</Link> */}

      <h1>Login</h1>
      <br />
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" onChange={handleInputs} />
        <br />
        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input type={togglePassword ? 'text' : 'password'} name="password" onChange={handleInputs} />
          <button type="button" onClick={handleTogglePassword}>
            {togglePassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <br />
        <button type="submit" disabled={!isFormDataValid}>
          Login
        </button>
      </form>
      {loginStatus && !loginStatus.success && <p className='err'>Incorrect email or password</p>}
      <br />
      <Link to='/register'>Register</Link>
    </>
  );
}
