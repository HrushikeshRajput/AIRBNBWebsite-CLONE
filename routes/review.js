//require express
const express = require("express");
//create router object
const router = express.Router({ mergeParams: true });
//Require WrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
//Require ExpressError class
const ExpressError = require("../utils/ExpressError.js");
//Require review model
const Review = require("../models/review.js");
// Importing the Listing model, which represents the schema for a database collection
const Listing = require("../models/listing.js");
//Require review.js from controllers
const reviewController = require("../controllers/review.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

//REVIEW
//Review POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

//exports router object
module.exports = router;
