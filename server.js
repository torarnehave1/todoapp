import passport from 'passport';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import testRoutes from './src/routes/test/test_routes.js';
import authroutes from './src/routes/auth/github_routes.js';
import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');

console.log(secret)


import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
  app.use(passport.initialize());
  app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/t', testRoutes);
app.use('/auth', authroutes)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});