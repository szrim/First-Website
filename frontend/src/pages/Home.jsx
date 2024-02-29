import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


function Home(){

  return (
    <>
    <Link to='/login'>Login</Link>
    <br />
      <h1> Home </h1>
    </>
  )
};

export default Home;