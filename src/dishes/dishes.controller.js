const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// MIDDLEWARE FUNCTIONS

// validateDish()
// Validates all fields provided for a dish, responds with code 400 and error message if validation fails.
function validateDish(req, res, next) {
  const { data: { dish } = {} } = req.body;
  const message = "";

  if(!dish.name || dish.name === "") message = "Dish must include a name";
  if(!dish.description || dish.description === "") message = "Dish must include a description";
  if(!dish.price) message = "Dish must include a price";
  if(dish.price < 0 || Number(dish.price) === NaN) message = "Dish must have a price that is an integer greater than 0";
  if(!dish.image_url || dish.image_url === "") message = "Dish must include a image_url"

  if (!message) {
    res.locals.dish = dish;
    return next();
  }
  return next({ status: 400, message: message });
}

// findDish()
// Searches the dishes array for the dish matching the provided dishId, responds with code 404 if dish is not found
function findDish(req, res, next) {
  const dishId = Number(req.params.dishId);
  const foundDish = dishes.find(dish => dish.id === dishId);
  if(foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  return next({ status: 404, message: `Dish does not exist: ${dishId}` });
}

// HANDLER FUNCTIONS

// GET /dishes => listDishes()
// Responds with a list of all existing dish data.
function listDishes(req, res) {
  res.json({ data: dishes });
}

// POST /dishes => createDish()
// Creates a new dish and responds with the newly created dish data.
function createDish(req, res) {
  res.locals.dish.id = nextId;
  dishes.push(res.locals.dish);
  res.status(201).json({ data: dish });
}

// GET /dishes/:dishId => readDish()
// Responds with the data of the dish matching parameter dishId.
function readDish(req, res) {
  res.json({ data: res.locals.dish });
}

// PUT /dishes/:dishId => updateDish()
// Updates the dish matching parameter dishId and responds with the updated dish data.
function updateDish(req, res) {
  res.locals.dish = req.body.data;
  res.json({ data: res.locals.dish });
}

module.exports = {
  listDishes,
  createDish: [validateDish, createDish],
  readDish:   [findDish, readDish],
  updateDish: [findDish, validateDish, updateDish],
}