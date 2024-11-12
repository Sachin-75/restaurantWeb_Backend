require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router/auth-router");
const foodrouter = require("./router/food-route");
const contactRoute = require("./router/contact-router");
const cartRoute = require("./router/cart-router");
const connectDb = require("./utils/db");

app.use(express.json());
app.use(cors());

app.use("/api/auth", router);
app.use("/api/food", foodrouter);
app.use("/api/form", contactRoute);
app.use("/api/cart", cartRoute);


app.get("/", (req, res) => {
    res.status(200).send("Welcome to my page");
});

const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at ${PORT}`);
    });
});
