const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const db = require('../Helpers/db');
const router = express.Router();
const sanitizeInput = require('../Helpers/sanitize');



//Gestione Utenti
router.get('/', async (req, res) => {
  const { page, name, surname, email } = req.query;
  const filter = {};

  if (name) {
    filter.name = sanitizeInput(name);
  }

  if (surname) {
    filter.surname = sanitizeInput(surname);
  }

  if (email) {
    filter.email = sanitizeInput(email);
  }

  const perPage = 10;
  const pageNumber = parseInt(page) || 1;

  try {
    const totalUsers = await db.collection('users').countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / perPage);

    const users = await db.collection('users')
      .find(filter)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .toArray();

    res.json({
      currentPage: pageNumber,
      totalPages: totalPages,
      users: users
    });
  } catch (error) {
    console.error('Error retrieving users from MongoDB', error);
    res.status(500).send('Internal Server Error');
  }
});

  
  router.post('/', async (req, res) => {
    const { name, surname, email } = req.body;
    const userName = sanitizeInput(name); 
    const userSurname = sanitizeInput(surname); 
    const userEmail = sanitizeInput(email); 
  
    if (!userName || !userSurname || !userEmail) {
      return res.status(400).send('Invalid user data');
    }
  
    const user = { name: userName, surname: userSurname, email: userEmail };
  
    try {
      const result = await db.collection('users').insertOne(user);
      user._id = result.insertedId;
      res.status(201).json(user);
    } catch (error) {
      console.error('Error inserting user into MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, surname, email } = req.body;
    const userName = sanitizeInput(name); 
    const userSurname = sanitizeInput(surname); 
    const userEmail = sanitizeInput(email);
  
    if (!userName || !userSurname || !userEmail) {
      return res.status(400).send('Invalid user data');
    }
  
    try {
      const result = await db.collection('users').updateOne(
        { _id: ObjectID(userId) },
        { $set: { name: userName, surname: userSurname, email: userEmail } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ _id: userId, name: userName, surname: userSurname, email: userEmail });
    } catch (error) {
      console.error('Error updating user in MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await db.collection('users').deleteOne({ _id: ObjectID(userId) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting user from MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });



    // Rotte per utenti e prodotti
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  // ID dell'utente per cercare le informazioni nel database
  try {
      const user = await db.collection('users').findOne({ _id: ObjectID(userId) });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Error retrieving user from MongoDB', error);
      res.status(500).send('Internal Server Error');
  }
});


  
  module.exports = router;