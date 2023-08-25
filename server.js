const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const app = express();
const port = 3000;
const db = require('./Helpers/db');
const sanitizeInput = require('../Helpers/sanitize');

app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

async function connect() {
  try {
    await client.connect();
    db = client.db('plantbasedfood');
    console.log('Connected to MongoDB');
  } catch (error) {
    throw error;
  }
}

db.connect()
  .then(() => {
    console.log('Connected to DB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Funzione di pulizia dei valori per prevenire NoSQL Injection
function sanitizeInput(value) {
  if (typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value)) {
    return value;
  }
  return '';
}

app.get('/', (req, res) => {
  res.send('Welcome!');
});

const orderRouter = require('./Routes/orders');
const productsRouter = require('./Routes/products');
const usersRouter = require('./Routes/users');


app.use('/orders', orderRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);