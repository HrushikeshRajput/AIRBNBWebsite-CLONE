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

  //Image URL for the listing, optional and must be a string
  //Default values is a specific image URL if no image is provided
  //A 'set' function ensures empty string values are replace with default URL
  image: {
    type: Object,
    properties: {
      filename: String,
      url: String,
    },
    // default: "https://unsplash.com/photos/ferns-in-the-sunlit-forest-look-vibrant-HZksGaLPJA4",
    // set: (v) => (v === "" ? "https://unsplash.com/photos/ferns-in-the-sunlit-forest-look-vibrant-HZksGaLPJA4" : v),
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
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
