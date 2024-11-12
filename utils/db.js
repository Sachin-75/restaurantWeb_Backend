const mongoose = require("mongoose"); 
const URI1 = process.env.MONGODB_URI;
// const URI = "mongodb://localhost:27017/foody";

const connectDb = async () => {
    try {
        await mongoose.connect(URI1); 
        console.log("Connection Successful");
    } catch (error) {
        console.log("Connection failed", error); 
        process.exit(0);
    }
};

module.exports = connectDb;
