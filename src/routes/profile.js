const express = require('express');
const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/', (req, res,) => {
  if(req.isAuthenticated()){
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    
    res.sendFile(path.join(__dirname, '..', 'public', 'profile', 'profile.html'));
  }
  else{
    res.redirect('localhost:3001');
  } 
});

router.get('/userdata', (req, res) => {
  if (req.isAuthenticated()) {
    const { username, loginTimes  } = req.user;
    res.status(200).json({ username, loginTimes });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});



module.exports = router;