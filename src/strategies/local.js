const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../database/schemas/User');
const { comparePassword } = require('../utils/helpers');


passport.use(
    new Strategy(
    {
        usernameField: 'email'
    }, 
    async (email, password, done) => {
        console.log(email);
        console.log(password);
        try {
            if(!email || !password){
                return done(null, false, {message: 'Missing Credentials'});
            } 
            const userDB = await User.findOne({ email });
            if(!userDB){
                return done(null, false, {message: 'User Not Found'})
            } 
            const isValid = comparePassword(password, userDB.password);
            if (isValid) {
                console.log('Authenticated Successfully!');
                userDB.loginTimes++
                userDB.save()
                console.log(userDB.loginTimes)
                return done(null, userDB);
            } else {
                console.log('Invalid Authentication');
                return done(null, null);
            }
      } catch(err){
        console.log(err)
        done(err, null);
      }
    })
);