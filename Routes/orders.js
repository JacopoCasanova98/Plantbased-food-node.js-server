const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const db = require('../Helpers/db');
const router = express.Router();
const sanitizeInput = require('../Helpers/sanitize');



//Gestione Ordini
router.get('/', async (req, res) => {
  const { date, productId, page } = req.query;
  const filter = {};

  if (date) {
    filter.date = sanitizeInput(date);
  }

  if (productId) {
    filter['products.productId'] = sanitizeInput(productId);
  }

  const perPage = 10;
  const pageNumber = parseInt(page) || 1;

  try {
    const totalOrders = await db.collection('orders').countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / perPage);

    const orders = await db.collection('orders')
      .find(filter)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .toArray();

    res.json({
      currentPage: pageNumber,
      totalPages: totalPages,
      orders: orders
    });
  } catch (error) {
    console.error('Error retrieving orders from MongoDB', error);
    res.status(500).send('Internal Server Error');
  }
});


  
  router.post('/', async (req, res) => {
    const { products: orderProducts, users: orderUsers } = req.body;
  
    if (!Array.isArray(orderProducts) || !Array.isArray(orderUsers)) {
      return res.status(400).send('Invalid order data');
    }
  
    const sanitizedOrderProducts = orderProducts.map((product) => ({
      productId: sanitizeInput(product.productId),
      quantity: sanitizeInput(product.quantity),
    }));
  
    const sanitizedOrderUsers = orderUsers.map((user) => ({
      userId: sanitizeInput(user.userId),
      quantity: sanitizeInput(user.quantity),
    }));
  
    const isValidOrder =
      sanitizedOrderProducts.every(
        (product) => product.productId && Number.isInteger(product.quantity)
      ) &&
      sanitizedOrderUsers.every((user) => user.userId && Number.isInteger(user.quantity));
  
    if (!isValidOrder) {
      return res.status(400).send('Invalid order data');
    }
  
    const order = { products: sanitizedOrderProducts, users: sanitizedOrderUsers };
  
    try {
      const result = await db.collection('orders').insertOne(order);
      order._id = result.insertedId;
      res.status(201).json(order);
    } catch (error) {
      console.error('Error inserting order into MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { products: orderProducts, users: orderUsers } = req.body;
  
    if (!Array.isArray(orderProducts) || !Array.isArray(orderUsers)) {
      return res.status(400).send('Invalid order data');
    }
  
    const sanitizedOrderProducts = orderProducts.map((product) => ({
      productId: sanitizeInput(product.productId),
      quantity: sanitizeInput(product.quantity),
    }));
  
    const sanitizedOrderUsers = orderUsers.map((user) => ({
      userId: sanitizeInput(user.userId),
      quantity: sanitizeInput(user.quantity),
    }));
  
    const isValidOrder =
      sanitizedOrderProducts.every(
        (product) => product.productId && Number.isInteger(product.quantity)
      ) &&
      sanitizedOrderUsers.every((user) => user.userId && Number.isInteger(user.quantity));
  
    if (!isValidOrder) {
      return res.status(400).send('Invalid order data');
    }
  
    try {
      const result = await db.collection('orders').updateOne(
        { _id: ObjectID(orderId) },
        { $set: { products: sanitizedOrderProducts, users: sanitizedOrderUsers } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ _id: orderId, products: sanitizedOrderProducts, users: sanitizedOrderUsers });
    } catch (error) {
      console.error('Error updating order in MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.delete('/:orderId', async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const result = await db.collection('orders').deleteOne({ _id: ObjectID(orderId) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting order from MongoDB', error);
      res.status(500).send('Internal Server Error');
    }
  });



  module.exports = router;