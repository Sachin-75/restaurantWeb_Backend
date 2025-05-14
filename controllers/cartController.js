const cartModel = require("../models/cartModel");

const addCartItems = async (req, res) => {
    const { menuItemId, name, quantity, image, price } = req.body;
    const userId = req.userId; 
    try {
        let cartItem = await cartModel.findOne({ userId, menuItemId });

        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.price = cartItem.price * quantity
            cartItem = await cartItem.save();
        } else {
            cartItem = new cartModel({ userId, menuItemId, name, quantity, image, price });
            await cartItem.save();
        }

        res.status(200).json(cartItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deleteCartItems = async (req, res) => {
    const { menuItemId } = req.query;
    const userId = req.userId;
    if (!menuItemId) {
        return res.status(400).json({ error: "menuItemId is required in query params." });
    }
     
    try {
        const deletedItem = await cartModel.deleteOne({menuItemId});
        if (!deletedItem) {
            return res.status(404).json({ error: "Cart item not found or already deleted." });
        }
        res.status(200).json({ message: "Cart item deleted successfully"});

    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const incrementCartItemQuantity = async (req, res) => {
    const { menuItemId } = req.query;
    const userId = req.userId;

    if (!menuItemId) {
        return res.status(400).json({ error: "menuItemId is required in query params." });
    }

    try {
        const updatedItem = await cartModel.findOneAndUpdate(
            { menuItemId, userId },
            { $inc: { quantity: 1 } },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Cart item not found." });
        }

        res.status(200).json({ message: "Cart item quantity incremented successfully", item: updatedItem });
    } catch (error) {
        console.error("Error incrementing cart item quantity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const decrementCartItemQuantity = async (req, res) => {
    const { menuItemId } = req.query;
    const userId = req.userId;

    if (!menuItemId) {
        return res.status(400).json({ error: "menuItemId is required in query params." });
    }

    try {
        const updatedItem = await cartModel.findOneAndUpdate(
            { menuItemId, userId },
            { $inc: { quantity: -1 } },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Cart item not found." });
        }

        res.status(200).json({ message: "Cart item quantity decremented successfully", item: updatedItem });
    } catch (error) {
        console.error("Error incrementing cart item quantity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



const getCartItems = async (req, res) => {
    const userId = req.userId;  
  
    try {
      const cartItems = await cartModel.find({ userId });
  
      const updatedCartItems = cartItems.map(item => ({
        ...item._doc,  
        price: item.price * item.quantity,  
      }));
  
      res.status(200).json(updatedCartItems); 
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


module.exports = { addCartItems, getCartItems, deleteCartItems, incrementCartItemQuantity, decrementCartItemQuantity };
