import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile(){

  const navigate = useNavigate();

  const handleClick = async () => {
    try{
      const res = await fetch('/api/auth/logout')
      if(res.ok){
        navigate('/')
      } else {
        console.log('error logging out', res)
      }
    } catch(err){
      console.error('error during logout', err);
    }
  }

  return(
    <div>
      <h1>Profile</h1>
      <button onClick={handleClick}>Logout</button>
    </div>
  )
};

export default Profile;