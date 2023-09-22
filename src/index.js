require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

const User = require('./database/schemas/User');
const googleUser = require('./database/schemas/googleUser');
require('./strategies/local');
require('./strategies/google');

//Routes
const groceriesRoute = require('./routes/groceries');
const marketsRoute = require('./routes/markets');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

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
  console.log('Serializing User...');
  console.log(user);
  done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
  console.log('deserializing User...');
  console.log(id);
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


app.use(express.static(path.join(__dirname, 'public', 'index')));
app.use('/api/v1/auth/login', express.static(path.join(__dirname, 'public', 'login')));
app.use('/api/v1/profile', express.static(path.join(__dirname, 'public', 'profile')));
app.use('/api/v1/auth/register', express.static(path.join(__dirname, 'public', 'register')));

app.use('/api/v1/groceries', groceriesRoute);
app.use('/api/v1/markets', marketsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/profile', profileRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'index.html'));
});

app.listen(PORT, () => console.log(`Running Express Server on Port ${PORT}!`));