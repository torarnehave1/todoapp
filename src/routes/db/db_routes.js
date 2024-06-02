// routes/dbRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Person from '../../models/person.js';
import Contact from '../../models/contact.js';
import Samtaler from '../../models/samtale.js';
import { MongoClient } from 'mongodb';
import User from '../../models/user.js';

const router = express.Router();


async function createUser(userData) {
  const user = new User(userData);
  try {
    await user.save();
    console.log('User saved successfully');
  } catch (err) {
    console.error('Error saving user: ', err);
  }
}

router.get('/register', async (req, res) => {
  await createUser({
    _id: new mongoose.Types.ObjectId(),
    name: 'Tor Arne Håve',
    email: 'torarnehave@gmail.com',
    password: 'Mandala1.',
    dateOfBirth: new Date('1990-01-01'),
    createdAt: new Date(),
  });
  res.send('User registration completed');
});



router.get('/test', (req, res) => { ///db/test/
  const dbState = mongoose.connection.readyState;
  const message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';
  res.render('test', { message });
});


router.get('/samtaler2', async (req, res) => {
  const uri = 'mongodb+srv://torarnehave:Q3AYMtCA62tOWNk1@cluster0.wcbzj0t.mongodb.net/slowyounet?retryWrites=true&w=majority'; // replace with your connection string
  const client = new MongoClient(uri, { useNewUrlParser: true});

  try {
    await client.connect();
    const collection = client.db('slowyounet').collection('Samtaler'); // replace 'your-db-name' with your database name
    const samtaler = await collection.find().toArray();
    res.json(samtaler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }
});


router.get('/samtaler', async (req, res) => {
  const uri = 'mongodb+srv://torarnehave:Q3AYMtCA62tOWNk1@cluster0.wcbzj0t.mongodb.net/slowyounet?retryWrites=true&w=majority'; // replace with your connection string
 
  mongoose.connect(uri).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

  try {
    console.log('Fetching Samtaler data...');
    const samtaler = await Samtaler.find();
    console.log('Data fetched:', samtaler);
    res.json(samtaler);
  } catch (error) {
    console.error('Error fetching Samtaler data:', error);
    res.status(500).json({ message: error.message });
  }
});


router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/contacts/notes', async (req, res) => {
  try {
    const contacts = await Contact.find({ Notes: { $exists: true } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Read - Get all persons /db/personer/
router.get('/personer', async (req, res) => {
  try {
    const personList = await Person.find();
    const personListWithId = personList.map(person => ({
      id: person._id,
      name: person.name,
      phone: person.phone,
      email: person.email,
    }));

    res.json(personListWithId);

  } catch (error) {
    console.error('Failed to fetch persons:', error);
    res.status(500).send({ error: 'Error fetching persons' });
  }
});












export default router;