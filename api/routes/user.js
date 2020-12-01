const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');

router.get("/myRented", UserController.user_get_all_my_rented);

router.post("/add", UserController.user_add_bike);

router.post("/cancel", UserController.user_cancel_bike);

module.exports = router;
