const dotenv = require('dotenv') 
dotenv.config({path: __dirname + '/.env'});
console.log('env:', process.env)
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const googleUser = require('../database/schemas/googleUser');
const { OAuth2Client } = require('google-auth-library');

const googleOAuthClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'http://localhost:3001/api/v1/auth/google/redirect',
  });
  

async function googleVerification(accessToken, refreshToken, profile, done) {
        try {
            const existingUser = await googleUser.findOne({ email: profile.emails[0].value });
            if (existingUser) {
                return done(null, existingUser);
            } else {
                const newUser = await googleUser.create({
                    userId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.log(err);
            return done(err, null);
        }
};

passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3001/api/v1/auth/google/redirect',
        scope: ['profile', 'email'],
      },
      googleVerification
    )
  );

module.exports = { googleOAuthClient, googleVerification };