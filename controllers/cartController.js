const cartModel = require("../models/cartModel");

// const addCartItems = async (req, res) => {
//     const { menuItemId, name, quantity, image, price } = req.body;
//     const userId = req.userId;  // From token, extracted in middleware

//     try {
//         let cartItem = await cartModel.findOne({ menuItemId });

//         if (cartItem) {
//             // Update quantity if the item is already in the cart
//             cartItem.quantity += quantity;
//             cartItem = await cartItem.save();
//         } else {
//             // Add userId manually to new cart item (not changing schema, just attaching for this session)
//             cartItem = new cartModel({
//                 menuItemId,
//                 name,
//                 quantity,
//                 image,
//                 price,
//                 userId  // Attach userId here temporarily
//             });
//             await cartItem.save();
//         }

//         res.status(200).json(cartItem);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const addCartItems = async (req, res) => {
    const { menuItemId, name, quantity, image, price } = req.body;
    const userId = req.userId; // Get the userId from the decoded token

    try {
        let cartItem = await cartModel.findOne({ userId, menuItemId });

        if (cartItem) {
            cartItem.quantity += quantity;
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






const getCartItems = async (req, res) => {
    const userId = req.userId;  // From token

    try {
        // const cartItems = await cartModel.find({ userId }).populate('menuItemId');
        const cartItems = await cartModel.find();
        console.log("Cart items fetched for user:", cartItems);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { addCartItems, getCartItems };
