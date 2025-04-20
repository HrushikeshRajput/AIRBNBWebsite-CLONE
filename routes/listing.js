//require express
const express = require("express");
//create router object
const router = express.Router();
//Require WrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
// Importing the Listing model, which represents the schema for a database collection
const Listing = require("../models/listing.js");
//Require isLoggedIn as middelware
const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");




//   Index route 
router.get(
  "/",
  wrapAsync(async (req, res) => {
    //Fetch all listings from the database using the Listing model
    const allListings = await Listing.find({});
    //Render the index view(index.ejs) located in the 'listing' folder
    //Pass the fetched listings data to the view as 'allListings'
    res.render("layouts/listings/index.ejs", { allListings });
  })
);

//NEW route
router.get("/new", isLoggedIn,(req, res) => {
  res.render("layouts/listings/new.ejs");
});

//Defining the show route to display individual information from the listing model
//for show route GET request is get on '/listing/:id'
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    //find the record using id from listing model
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if (!listing) {
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    //render the show.ejs file
    res.render("layouts/listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id; //to save current user information 
    await newListing.save();
    req.flash("success","New Listing is Created!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    };
    res.render("layouts/listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  })
);   



//exports router object
module.exports = router;
