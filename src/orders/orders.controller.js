const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// MIDDLEWARE FUNCTIONS

// validateOrder()
// Validates all fields provided for an order, responds with code 400 and error message if validation fails.
function validateOrder(req, res, next) {
  const order = req.body.data;
  var error = { status: 400, message: ""};

  if(!order.deliverTo || order.deliverTo === "") { error.message = "Order must include a deliverTo"; return next(error) }
  if(!order.mobileNumber || order.mobileNumber === "") { error.message = "Order must include a mobileNumber"; return next(error) }
  if(!order.dishes) { error.message = "Order must include a dish"; return next(error) }
  if(!Array.isArray(order.dishes) || order.dishes === []) { error.message = "Order must include at least one dish"; return next(error) }
  order.dishes.forEach(dish, index => {
    if(!dish.quantity || dish.quantity < 1 || Number.isInteger(dish.quantity)) {
      error.message = `Dish ${index} must have a quantity that is an integer greater than 0`;
      return next(error);
    }
  });

  if (!error.message) {
    res.locals.order = order;
    return next();
  }
}

// HANDLER FUNCTIONS

// GET /orders => listOrders()
// Responds with a list of all existing order data.
function listOrders(req, res) {
  res.json({ data: orders });
}

// POST /orders => createOrder()
// Creates a new order and responds with the newly created order data.
function createOrder(req, res) {
  res.locals.order.id = nextId();
  orders.push(res.locals.order);
  res.status(201).json({ data: res.locals.order });
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
function destroyOrder(req, res) {

}

module.exports = {
  listOrders,
  createOrder: [validateOrder, createOrder],
  readOrder,
  updateOrder,
  destroyOrder,
}
