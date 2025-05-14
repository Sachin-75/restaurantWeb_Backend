const express = require("express");
const router = express.Router();

const {addCartItems, getCartItems, deleteCartItems, incrementCartItemQuantity, decrementCartItemQuantity} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/get").get(authMiddleware, getCartItems);
router.delete('/delete', authMiddleware, deleteCartItems);
router.post("/add",authMiddleware, addCartItems);
router.put("/increment", authMiddleware, incrementCartItemQuantity)
router.put("/decrement", authMiddleware, decrementCartItemQuantity)

module.exports = router;
