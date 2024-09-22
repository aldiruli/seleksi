const productController = require('../controllers/products.controller');

const express = require('express');
const route = express.Router();

const multer = require('multer');
const upload = multer();

route.post('/products',
productController.createProduct);

route.get('/products',
productController.getProduct); 

route.get('/products/:id',
productController.getProductById);

route.put('/products/:id',
productController.updateProduct); 

route.delete('/products/:id', 
productController.deleteProduct); 

module.exports = route;