const express = require("express");
const { getFood } = require("../controllers/foodController");

const router = express.Router();

router.get("/",getFood);

module.exports = router;



 // useEffect(() => {
  //   fetch("/dishes_menu.json")
  //     .then(res => res.json())
  //     .then(data => {
  //       const dishes = data.filter((item) => item.category === "popular");
  //       setRecipes(dishes);
  //     });
  // }, []);