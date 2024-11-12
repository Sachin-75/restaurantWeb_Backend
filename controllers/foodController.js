const foodModel = require("../models/foodModel");

const getFood= async (req,res)=>{
    try {
        const food = await foodModel.find();
        res.status(200).json(food);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error)
    }
}

module.exports = { getFood };


// require("dotenv").config();
// const connectDb = require("../utils/db");
// const foodModel = require("../models/foodModel");
// const productJson = require("../foods.json");

// const init = async()=>{
//     try {
//         await connectDb(process.env.MONGODB_URI);
        
//         await foodModel.create(productJson);
//         console.log("added successfully");
//     } catch (error) {
//         console.log(error);
//     }
// }

// init();