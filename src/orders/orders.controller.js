const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// MIDDLEWARE FUNCTIONS



// HANDLER FUNCTIONS

// GET /orders => listOrders()
// Responds with a list of all existing order data.
function listOrders(req, res) {

}

// POST /orders => createOrder()
// Creates a new order and responds with the newly created order data.
function createOrder(req, res) {

}

// GET /orders/:orderId => readOrder()
// Responds with the data of the order matching parameter orderId.
function readOrder(req, res) {

}

// PUT /orders/:orderId => updateOrder()
// Updates the order matching parameter orderId and responds with the updated order data.
function updateOrder(req, res) {
  
}

// DELETE /orders/:orderId => destroyOrder()
// Deletes the order matching parameter orderId and responds with code 204.

module.exports = {
  listOrders,
  createOrder,
  readOrder,
  updateOrder,
}
