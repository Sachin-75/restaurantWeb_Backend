const mongoose = require("mongoose");
const foodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const foodModel = mongoose.model("food",foodSchema);
module.exports = foodModel;