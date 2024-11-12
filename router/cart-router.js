const express = require("express");
const router = express.Router();

const {addCartItems, getCartItems} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/get").get(authMiddleware, getCartItems);

router.route("/add").post( addCartItems);

module.exports = router;