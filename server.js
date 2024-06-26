import passport from 'passport';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import testRoutes from './src/routes/test/test_routes.js';
import authroutes from './src/routes/auth/github_routes.js';
import dbroutes from './src/routes/db/db_routes.js';
import systemroutes from './src/routes/api/system.js';
import crypto from 'crypto';
import { connect } from 'mongoose';
import bodyParser from 'body-parser';


const secret = crypto.randomBytes(64).toString('hex');

import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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
app.use('/db',dbroutes)
app.use('/api',systemroutes)

connect(process.env.MONGO_DB_URL)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});