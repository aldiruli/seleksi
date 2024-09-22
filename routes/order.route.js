const orderController = require('../controllers/orders.controller');

const express = require('express');
const route = express.Router();

const multer = require('multer');
const upload = multer();

route.post('/orders',
orderController.createOrder);

route.get('/orders',
orderController.getOrders); 

route.get('/orders/:id',
orderController.getOrderById);

route.delete('/orders/:id', 
orderController.deleteOrder); 

module.exports = route;