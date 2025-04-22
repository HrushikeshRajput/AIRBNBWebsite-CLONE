const express = require("express");
const router = express.Router();
//Require user.js model
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
//Require passport
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
//Require user.js from controllers
const userController = require("../controllers/user.js");

//using router.route method to combine "/signup" route
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

//using router.route method to combine "/login" route
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//Define GET rout for logged out page
router.get("/logout", userController.logout);

module.exports = router;
