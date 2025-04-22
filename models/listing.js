//Importing the Mongoose library to interact with a MongoDB
const mongoose = require("mongoose");

//Require review model
const Review = require("./review.js");

//Creating a Schema object to define the structure of data in the database
const Schema = mongoose.Schema;

//Defining the schema (structure) for the 'Listing' collection in the database
const listingSchema = new Schema({
  //Title of the listing, must be a string and is required (cannot be empty)
  title: {
    type: String,
    // required: true,
  },
  description: String,
  image:{
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" }, //It single owner that refer to the User property
});
//middelware for listing review when listing deletes then its respective reviews also delete
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
//Creating a model named 'Listing' based on the schema defined above
//This represents the 'Listing' collection in the MongoDB database
const Listing = mongoose.model("Listing", listingSchema);

//Exporting the 'Listing' model to use it in other files or parts of the project
module.exports = Listing;
