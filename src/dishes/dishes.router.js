const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:dishId")
  .get(controller.readDish)     // Responds with the data of the dish matching parameter dishId.
  .put(controller.updateDish)   // Updates the dish matching parameter dishId and responds with the updated dish data.
  .all(methodNotAllowed);       // Returns a 405 code for any forbidden or non-existent methods

router.route("/")  
  .get(controller.listDishes)   // Responds with a list of all existing dish data.
  .post(controller.createDish)  // Creates a new dish and responds with the newly created dish data.
  .all(methodNotAllowed);       // Returns a 405 code for any forbidden or non-existent methods

module.exports = router;
