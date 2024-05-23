import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const router = express.Router();

const clientid = process.env.VITE_API_GITHUB_APP_CLIENTID_3;
const clientsecret = process.env.VITE_API_GITHUB_APP_CLIENTSECRET_3;

passport.use(new GitHubStrategy({
    clientID:clientid,
    clientSecret:clientsecret ,
    callbackURL: "http://localhost:5173/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Here you would look up the user in your database
    // For this example, we'll just return the profile
    done(null, profile);
  }
));

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

  router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: 'http://localhost:5173/login.html' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.redirect('/');
    //res.render('userprofile', { user: req.user });
    res.render('userprofile', { user: req.user, imageUrl: req.user.photos[0].value });
   // res.json({
   //   success: true,
    //  message: 'Authentication successful',
  //    user: req.user
  //  });
  });

export default router