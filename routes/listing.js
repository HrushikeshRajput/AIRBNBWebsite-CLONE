//require express
const express = require("express");
//create router object
const router = express.Router();
//Require WrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
// Importing the Listing model, which represents the schema for a database collection
const Listing = require("../models/listing.js");
//Require isLoggedIn  as middelware
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
//Require listing.js from controllers
const listingController = require("../controllers/listing.js");
//Require multer package
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//using router.route method to combine common path root routes of "/"
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//NEW route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//using router.route method to combine common path of "/"id" routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//exports router object
module.exports = router;
