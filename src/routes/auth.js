const express = require('express')
const { Router } = require('express');
const passport = require('passport')
const User = require('../database/schemas/User');
const { hashPassword, comparePassword } = require('../utils/helpers');
const { authRegisterController} = require('../controllers/auth');
const path = require('path');
const { googleOAuthClient } = require('../strategies/google');

const router = Router();



router.get('/usernameAvailability', async (req, res) => {
  const { username } = req.query;
  
  try {
    const existingUser = await User.findOne({ username });

    if(existingUser){
      return res.json({available: false});
    } else {
      return res.json({available: true});
    }
  } catch(err){
    console.log('Error checking username availability: ', err)
    return res.status(500).send({message: 'Internal Server Error'});
  };
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login', 'login.html'))
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {

      return res.status(401).send({ message: 'Incorrect credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log('Logged In')
      return res.status(200).redirect('/api/v1/profile');
    });
  })(req, res, next);
});

router.post('/register', authRegisterController);

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'register', 'register.html'));
});

router.get('/google', passport.authenticate('google'), (req, res) => {
  res.sendStatus(200)
});

router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
  req.session.googleAccessToken = req.user.googleAccessToken;
  res.redirect('/api/v1/profile')
});

router.get('/logout', async function (req, res, next) {
  console.log(req.session)
  if (req.user && req.user.googleAccessToken) {
    try {
      console.log('ACCESS TOKEN HERE')
      // Revoke the Google OAuth access token using the same client instance
      await googleOAuthClient.revokeToken(req.session.googleAccessToken);
      console.log('TOKEN DELETED')
      req.logout(err => {
        if (err) { return next(err); }
      });
      res.redirect('/')
    } catch (err) {
      console.error('Error revoking Google OAuth access token:', err);
    }
  } else {
    console.log('NO TOKEN')
    // If there's no access token
    req.logout(err => {
      if (err) { return next(err); }
    })
    res.redirect('/')
  };
});



module.exports = router;