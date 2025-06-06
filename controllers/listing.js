//Require Listing
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  //Fetch all listings from the database using the Listing model
  const allListings = await Listing.find({});
  //Render the index view(index.ejs) located in the 'listing' folder
  //Pass the fetched listings data to the view as 'allListings'
  res.render("layouts/listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("layouts/listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  //find the record using id from listing model
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  //render the show.ejs file
  res.render("layouts/listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //to save current user information
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing is Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  //To show preview of the image with low quality
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("layouts/listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
 

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
