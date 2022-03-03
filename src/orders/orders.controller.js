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
  const { deliverTo, mobileNumber, dishes } = order; // makes validation code cleaner
  var error = { status: 400, message: ""};

  if(!deliverTo || deliverTo === "")                { error.message = "Order must include a deliverTo"; return next(error) }
  if(!mobileNumber || mobileNumber === "")          { error.message = "Order must include a mobileNumber"; return next(error) }
  if(!dishes)                                             { error.message = "Order must include a dish"; return next(error) }
  if(!Array.isArray(dishes) || dishes.length === 0) { error.message = "Order must include at least one dish"; return next(error) }
  dishes.forEach((dish, index) => {
    if(!dish.quantity || dish.quantity < 1 || !Number.isInteger(dish.quantity)) {
      error.message = `Dish ${index} must have a quantity that is an integer greater than 0`;
      return next(error);
    }
  });

  if (!error.message) {
    res.locals.order = order;
    return next();
  }
}

// findOrder()
// Searches the orders array for the order matching the provided orderId, responds with code 404 if order is not found
function findOrder(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find(order => order.id === orderId);
  if(foundOrder) {
    res.locals.order = foundOrder;
    res.locals.orderId = orderId; // Passes to validateOrderUpdate()
    return next();
  }
  return next({ status: 404, message: `Order does not exist: ${orderId}` });
}

// validateOrderUpdate()
// Validates ID matching and order status, responds with code 404 if validation fails
function validateOrderUpdate(req, res, next) {
  const id = req.body.data.id;
  if (id && res.locals.orderId !== id) {
    return next({ status: 400, message: `Order id does not match route id. Order: ${id}, Route: ${res.locals.orderId}` });
  }
  switch (res.locals.order.status) {
    case "pending":
    case "preparing":
    case "out-for-delivery":
      return next();
    case "delivered":
      return next({ status: 400, message: `A delivered order cannot be changed` });
    default:
      return next({ status: 400, message: `Order must have a status of pending, preparing, out-for-delivery, delivered` });
  }
}

// validateDestroy()
// Validates order for eligibility to be destroyed, responds with code 400 if validation fails
function validateDestroy(req, res, next) {
  if (res.locals.order.status === "pending") {
    return next();
  }
  return next({ status: 400, message: `An order cannot be deleted unless it is pending` });
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
  res.json({ data: res.locals.order });
}

// PUT /orders/:orderId => updateOrder()
// Updates the order matching parameter orderId and responds with the updated order data.
function updateOrder(req, res) {
  res.locals.order = req.body.data;
  if (!res.locals.order.id) res.locals.order.id = res.locals.orderId;
  res.json({ data: res.locals.order });
}

// DELETE /orders/:orderId => destroyOrder()
// Deletes the order matching parameter orderId and responds with code 204.
function destroyOrder(req, res) {
  const orderIndex = orders.findIndex(order => order.id === res.locals.orderId);
  if (orderIndex > -1) {
    orders.splice(orderIndex, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  listOrders,
  createOrder:  [validateOrder, createOrder],
  readOrder:    [findOrder, readOrder],
  updateOrder:  [findOrder, validateOrder, validateOrderUpdate, updateOrder],
  destroyOrder: [findOrder, validateDestroy, destroyOrder],
}
