#!/usr/bin/yarn dev
import express = require('express');
import redis = require('redis');
import { promisify } = require('util');

const app = express();
const client = redis.createClient();
client.on('error', (err) => 
	console.error('Redis client not connected to the server:', err));
client.on('connect', () => 
	console.log('Redis client connected to the server'));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const listProducts = [
  { itemId: 1, itemName: 
	  'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 
	  'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 
	  'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 
	  'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

const getItemById = (id) => listProducts.find(product => product.itemId === id);

const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : null;
};

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null ? currentStock : item.initialAvailableQuantity;

  res.json({
    itemId: item.itemId,
    itemName: item.itemName,
    price: item.price,
    initialAvailableQuantity: item.initialAvailableQuantity,
    currentQuantity
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null ? currentStock : 
  item.initialAvailableQuantity;

  if (currentQuantity <= 0) {
    return res.json({ status: 'Not enough stock available', itemId });
  }

  await reserveStockById(itemId, currentQuantity - 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

const PORT = 1245;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
