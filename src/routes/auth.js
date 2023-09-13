const express = require('express')
const { Router } = require('express');
const passport = require('passport')
const User = require('../database/schemas/User');
const { hashPassword, comparePassword } = require('../utils/helpers');
const { authRegisterController} = require('../controllers/auth');
const path = require('path');

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
  router.use(express.static(path.join(__dirname, '..', 'public', 'login')))
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
  router.use(express.static(path.join(__dirname, '..', 'public', 'register')));
  res.sendFile(path.join(__dirname, '..', 'public', 'register', 'register.html'));
});

router.get('/google', passport.authenticate('google'), (req, res) => {
  res.sendStatus(200)
});

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.sendStatus(200)
});

router.get('/google/logout', (req, res, next) => {
  req.logout((err) => {
    if(err) { return next(err) }
    res.redirect('/')
  })
})

router.get('/logout', function(req, res, next) {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/')
  });
});


module.exports = router;