import React, {useState, useEffect} from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './containers/RegisterContainer';
import Profile from './pages/Profile';

function App() {
  
  useEffect(()=>{
    console.log('parent mounted')
    return()=> {
      console.log('parent unmounted')
    }
  }, [])

  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);

  useEffect(()=> {
    const isAuthenticated = async () => {
      try{
        console.log('Checking authentication status')
        const res = await fetch('/api/auth/check-auth');
        const data = await res.json();
        setAuth(data.authenticated);
        console.log('auth status checked, result:', data.authenticated)
        setLoading(false)
      } catch(err) {
        console.error('Error checking authentication', err);
        setAuth(false);
        setLoading(false)
      }
    };
    isAuthenticated()
  }, [])



  return (
   <>
   {loading && <p>Loading authentication status...</p>}

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={loading ? null : auth ? <Profile /> : <Navigate to='/login' />}/>
    </Routes>
   </>
  )
}

export default App;
