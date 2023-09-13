require('dotenv').config({path: '../../.env'});
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const googleUser = require('../database/schemas/googleUser');

/*passport.serializeUser((user, done) => {
    console.log('Serializing User...');
    console.log(user);
    done(null, user.id);
});
    
passport.deserializeUser(async (id, done) => {
    console.log('deserializing User...');
    console.log(id);
    try {
        const user = await googleUser.findById(id);
        if(!user) throw new Error('User not found');
        console.log(user);
        done(null, user);
    } catch(err){
        console.log(err);
        done(err, null);
    }
});*/

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
}

passport.use(
    new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3001/api/v1/auth/google/redirect',
        scope: ['profile', 'email']
    }, googleVerification
    )
);

module.exports = { googleVerification };