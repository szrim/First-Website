require('dotenv').config({path: '../.env'});

const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

const User = require('./database/schemas/User');
const googleUser = require('./database/schemas/googleUser');
require('./strategies/local');
//require('./strategies/google');

const authRoute = require('./routes/auth');

require('./database/mongodb');
require('./database/sql');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions'
    })
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
  try {
      const localUser = await User.findById(id);
      const gUser = await googleUser.findById(id);

      if(localUser){
        done(null, localUser)
      } else if(gUser) {
        done(null, gUser)
      } else {
        throw new Error('User Not Found')
      }
  } catch(err){
      console.log(err);
      done(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);

app.listen(PORT, () => console.log(`Running Express Server on Port ${PORT}!`));