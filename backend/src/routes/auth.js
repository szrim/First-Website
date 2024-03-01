const express = require('express')
const { Router } = require('express');
const passport = require('passport')
const User = require('../database/schemas/User');
const { hashPassword, comparePassword } = require('../utils/helpers');
const { authRegisterController} = require('../controllers/auth');
const path = require('path');
//const { googleOAuthClient } = require('../strategies/google');

const router = Router();



router.get('/usernameAvailability', async (req, res) => {
  const { username } = req.query;
  
  try {
    const existingUser = await User.findOne({ username });
    if(existingUser){
      return res.json({available: false, message: 'Username already in use'});
    } else {
      return res.json({available: true, message: 'Username available'});
    }
  } catch(err){
    console.log('Error checking username availability: ', err)
    return res.status(500).send({message: 'Error checking username availablity'});
  };
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({message: "Invalid Credentials"})
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log('Logged In')
      return res.status(201).send({message: 'User logged in'})
    });
  })(req, res, next);
});

router.post('/register', authRegisterController);


// router.get('/google', passport.authenticate('google'), (req, res) => {
//   res.sendStatus(200)
// });

// router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
//   req.session.googleAccessToken = req.user.googleAccessToken;
//   res.redirect('/api/v1/profile')
// });

router.get('/logout', async (req, res, next) => {
  console.log(req.session)
  if (req.user) {
    try {
      req.logout(err => {
        if (err) { return next(err); }
      });
      res.send({message: 'Logged Out'})
    } catch (err) {
      console.error('Error logging out', err);
    }
  } else {
    console.error('No User')
  };
});


router.get('/check-auth', (req, res) => {
  if(req.isAuthenticated()){
    res.json({authenticated: true})
  } else {
    res.json({authenticated: false})
  }
});

router.post('/check-email', async (req, res) => {
  const {email} = req.body;
  try{
    const emailDB = User.findOne({email});
    if(emailDB){
      res.json({available: false, message: 'Email already in use'})
    } else {
      res.json({available: true})
    }
  }catch(err){
    console.error('Error checking email', err)
    res.status(500).json('Error checking email validity')
  }
});

module.exports = router;