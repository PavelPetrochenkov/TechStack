const express = require("express");
const router = express.Router();

const BikeController = require('../controllers/bike');

router.get("/", BikeController.bike_get_all);

router.post("/create", BikeController.bike_create_bike);

router.post("/update", BikeController.bike_update_bike);

router.delete("/", BikeController.bike_delete_bike);


module.exports = router;
