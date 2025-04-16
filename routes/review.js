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

const { validateReview } = require("../middleware.js");

//REVIEW
//Review POST ROUTE
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

//exports router object
module.exports = router;
