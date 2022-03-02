const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// MIDDLEWARE FUNCTIONS



// HANDLER FUNCTIONS

// GET /dishes => listDishes()
// Responds with a list of all existing dish data.
function listDishes(req, res) {

}

// POST /dishes => createDish()
// Creates a new dish and responds with the newly created dish data.
function createDish(req, res) {

}

// GET /dishes/:dishId => readDish()
// Responds with the data of the dish matching parameter dishId.
function readDish(req, res) {

}

// PUT /dishes/:dishId => updateDish()
// Updates the dish matching parameter dishId and responds with the updated dish data.
function updateDish(req, res) {
  
}

module.exports = {
  listDishes,
  createDish,
  readDish,
  updateDish,
}