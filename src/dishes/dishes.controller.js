const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// MIDDLEWARE FUNCTIONS

// validateDish()
// Validates all fields provided for a dish, responds with code 400 and error message if validation fails.
function validateDish(req, res, next) {
  const dish = req.body.data;
  var error = { status: 400, message: ""};

  if(!dish.name || dish.name === "")                      { error.message = "Dish must include a name"; return next(error) }
  if(!dish.description || dish.description === "")        { error.message = "Dish must include a description"; return next(error) }
  if(!dish.price)                                         { error.message = "Dish must include a price"; return next(error) }
  if(dish.price < 0 || dish.price !== Number(dish.price)) { error.message = "Dish must have a price that is an integer greater than 0"; return next(error) }
  if(!dish.image_url || dish.image_url === "")            { error.message = "Dish must include a image_url"; return next(error) }

  if (!error.message) {
    res.locals.dish = dish;
    return next();
  }
}

// findDish()
// Searches the dishes array for the dish matching the provided dishId, responds with code 404 if dish is not found
function findDish(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find(dish => dish.id === dishId);
  if(foundDish) {
    res.locals.dish = foundDish;
    res.locals.dishId = dishId; // Passes to checkIdMatch()
    return next();
  }
  return next({ status: 404, message: `Dish does not exist: ${dishId}` });
}

// checkIdMatch()
// Validates that the dishId parameter and the dish.id in the message body match, responds with code 404 if mismatched
function checkIdMatch(req, res, next) {
  const id = req.body.data.id;
  if (!id || res.locals.dishId === id) return next();
  return next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${res.locals.dishId}` });
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
  res.locals.dish.id = nextId();
  dishes.push(res.locals.dish);
  res.status(201).json({ data: res.locals.dish });
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
  if (!res.locals.dish.id) res.locals.dish.id = res.locals.dishId;
  res.json({ data: res.locals.dish });
}

module.exports = {
  listDishes,
  createDish: [validateDish, createDish],
  readDish:   [findDish, readDish],
  updateDish: [findDish, checkIdMatch, validateDish, updateDish],
}