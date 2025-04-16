const express = require("express");
const router = express.Router(); //router object

//creates routes for posts
//Index
router.get("/", (req, res) => {
  res.send("GET for posts");
});

//show
router.get("/:id", (req, res) => {
  res.send("GET for post id");
});

//posts
router.post("/", (req, res) => {
  res.send("POST for post ");
});

//Delete
router.get("/:id", (req, res) => {
  res.send("Delete for post id");
});

//exports router object
module.exports = router;
