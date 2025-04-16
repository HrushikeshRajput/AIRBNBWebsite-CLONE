const express = require("express");
const router = express.Router(); //router object

//creates routes for users
//Index-users
router.get("/", (req, res) => {
  res.send("GET for users");
});

//show-users
router.get("/:id", (req, res) => {
  res.send("GET for user id");
});

//posts-users
router.post("/", (req, res) => {
  res.send("POST for user ");
});

//Delete-users
router.get("/:id", (req, res) => {
  res.send("Delete for user id");
});

//exports router object
module.exports = router;
