import express from 'express';
import SystemLog from '../../models/SystemLog.js';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';


const router = express.Router();



router.get('/testconn', async (req, res) => {
  let sysmessage = req.query.message;
  const dbState = mongoose.connection.readyState;
  const message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';

  if (dbState !== 1) {
    return res.render('test', { message }); // If the database connection failed, send the response immediately
  }

  // If sysmessage is empty or not provided, set it to a default message
  if (!sysmessage) {
    sysmessage = 'This is a syslog message';
  }

  try {
    const collection = mongoose.connection.db.collection('systemlog');
    await collection.insertOne({
      message: sysmessage,
      timestamp: Date.now()
    });
    res.render('test', { message });
  } catch (err) {
    res.status(500).send(err); // Send an error message if inserting the document failed
  }
});


router.get('/syslogtest', async (req,res)=>{
  const uri = 'mongodb+srv://torarnehave:Q3AYMtCA62tOWNk1@cluster0.wcbzj0t.mongodb.net/slowyounet?retryWrites=true&w=majority'; // replace with your connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db('slowyounet').collection('systemlog'); // replace 'your-db-name' with your database name
    collection.insertOne(
      {
        message: 'Test message',
        timestamp: Date.now()
      }   

    )
    res.status(200).send('Log saved');
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }

})


router.get('/message', (req, res) => {
  res.send('This is a test message');
});

router.get('/systemlog', async (req, res) => {

  const uri = 'mongodb+srv://torarnehave:Q3AYMtCA62tOWNk1@cluster0.wcbzj0t.mongodb.net/slowyounet?retryWrites=true&w=majority'; // replace with your connection string
 
  mongoose.connect(uri).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
  const message = req.query.message;

  try {
    const log = new SystemLog({ message });
    await log.save();
    res.status(200).send('Log saved');
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;