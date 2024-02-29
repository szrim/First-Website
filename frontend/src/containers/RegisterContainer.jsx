import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterPage from '../components/RegisterPage';

export default function RegisterContainer(){

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    cPassword: ''
  });``
  
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [emailValidStatus, setEmailValidStatus] = useState('');
  const [usernameValidStatus, setUsernameValidStatus] = useState('');
  const [passwordStrengthStatus, setPasswordStrengthStatus] = useState('');

  useEffect(()=> {
    const checkAll = async ()=> {

      const allFieldsNotEmpty = checkNotEmpty(formData);
  
    // Check if username is valid
      const usernameValidityMessage = checkUsernameValidity(formData.username);
  
      // Check if email is valid
      const emailValidityMessage = checkEmailValidity(formData.email);
  
      // Check if password is strong
      const passwordIsStrong = isPasswordStrong(formData.password);
  
      // Check if passwords match
      const passwordsDoMatch = passwordsMatch(formData.password, formData.cPassword);
  
      // Update error states based on validation results
      setPasswordStrengthStatus(await passwordIsStrong ? '' : 'Password must contain at least 1 upper case, numeric, and special character');
      setUsernameValidStatus(await usernameValidityMessage || '');
      setEmailValidStatus(await emailValidityMessage || '');
  
      // Update isFormValid based on all checks
      setIsFormDataValid(
        allFieldsNotEmpty &&
        !passwordIsStrong &&
        !usernameValidityMessage &&
        !emailValidityMessage &&
        passwordsDoMatch
        )
    }
    checkAll();
  }, [formData]);
 
  const checkNotEmpty = (fields) => {
    for (const key in fields) {
      if (!fields[key].trim()) {
        return false;
      }
    }
    return true;
  };

  const checkUsernameValidity = async (username) => {
    // Regex check for username
    const regex = /^[a-zA-Z0-9_ ]{3,30}$/;
    const isValidUsername = regex.test(username);
  
    if (!isValidUsername) {
      return 'Username must only contain letters, numbers, underscores, spaces and must be 3 - 30 characters';
    };
  
    try {
      const res = await fetch(`/api/auth/usernameAvailability?username=${username}`);
      if (res.ok) {
        const result = await res.json();
        return result.message
      } else {
        return 'Error checking username validity';
      }
    } catch (err) {
      console.error('Error checking username validity', err);
      return 'Error checking username validity';
    }
  };
  
  const checkEmailValidity = async (email) => {
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });
  
      if (res.ok) {
        const result = await res.json();
        return result.message
      } else {
        return 'Error checking email validity'
      }
    } catch (err) {
      console.error('Error checking email validity', err);
      return false;
    }
  };
  

  const isPasswordStrong = password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const passwordsMatch = (password, cPassword) => {
    return password === cPassword;
  };

 
  const handleInputs = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleRegister = async () => {
    try {
      if(isFormDataValid){
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if(res.ok){
          await navigate('/profile')
        } else {
          console.error('Error registering')
        }
      }
    }catch(err){
      console.error('Error registering')
    }
  };

  return(
    <RegisterPage onInputChange={handleInputs} onValidForm={isFormDataValid} onIsPasswordStrong={passwordStrengthStatus} onIsEmailValid={emailValidStatus} onIsUsernameValid={usernameValidStatus} onPasswordMatch={passwordsMatch} onHandleRegister={handleRegister} />
  )
};