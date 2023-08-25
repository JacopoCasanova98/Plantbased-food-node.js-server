const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const db = require('../Helpers/db');
const router = express.Router();
const sanitizeInput = require('../Helpers/sanitize');



//Gestione Prodotti 
router.get('/', async (req, res) => {
  const { page, name } = req.query;
  const filter = {};

  if (name) {
    filter.name = sanitizeInput(name);
  }

  const perPage = 10;
  const pageNumber = parseInt(page) || 1;

  try {
    const totalProducts = await db.collection('products').countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / perPage);

    const products = await db.collection('products')
      .find(filter)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .toArray();

    res.json({
      currentPage: pageNumber,
      totalPages: totalPages,
      products: products
    });
  } catch (error) {
    console.error('Error retrieving products from MongoDB', error);
    res.status(500).send('Internal Server Error');
  }
});
  
  router.post('/', async (req, res) => {
    const { name } = req.body;
    const productName = sanitizeInput(name); 
  
    if (!productName) {
      return res.status(400).send('Invalid product name');
    }
  
    const product = { name: productName };
  
    try {
      const result = await db.collection('products').insertOne(product);
      product._id = result.insertedId;
      res.status(201).json(product);
    } catch (error) {
      console.error('Error inserting product into MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    const { name } = req.body;
    const productName = sanitizeInput(name); 
  
    if (!productName) {
      return res.status(400).send('Invalid product name');
    }
  
    try {
      const result = await db.collection('products').updateOne(
        { _id: ObjectID(productId) },
        { $set: { name: productName } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ _id: productId, name: productName });
    } catch (error) {
      console.error('Error updating product in MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const result = await db.collection('products').deleteOne({ _id: ObjectID(productId) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting product from MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });

  

  router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
  
    // ID del prodotto per cercare le informazioni nel database
    try {
        const product = await db.collection('products').findOne({ _id: ObjectID(productId) });
  
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
  
        res.json(product);
    } catch (error) {
        console.error('Error retrieving product from MongoDB', error);
        res.status(500).send('Internal Server Error');
    }
  });
  
  


  module.exports = router;