const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:orderId")
  .get(controller.readOrder)        // Responds with the data of the order matching parameter orderId.
  .put(controller.updateOrder)      // Updates the order matching parameter orderId and responds with the updated order data.
  .delete(controller.destroyOrder)  // Deletes the order matching parameter orderId and responds with code 204.
  .all(methodNotAllowed);           // Returns a 405 code for any forbidden or non-existent methods

router.route("/")  
  .get(controller.listOrders)       // Responds with a list of all existing order data.
  .post(controller.createOrder)     // Creates a new order and responds with the newly created order data.
  .all(methodNotAllowed);           // Returns a 405 code for any forbidden or non-existent methods

module.exports = router;
