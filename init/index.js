//Importing the Mongoose library to interact with the MongoDB Database
const mongoose = require("mongoose");
//Importing the data.js file for performing CRUD operation on the sample data that contain in data.js file
const initData = require("./data.js");
// Importing the Listing model, which represents the schema for a database collection
const Listing = require("../models/listing.js");

//Defining the MongoDB connection URL for the 'wanderlust' database
const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

//Connecting to the MongoDB database using Mongoose
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

//Asynchronous function to connect to the MongoDB database
async function main() {
  //Using Mongoose to connect to the database at the specified URL
  await mongoose.connect(mongoUrl);
}

// Define an asynchronous function called initDB to initialize the database
const initDB = async () => {
  // Remove all existing data from the 'Listing' collection in the database
  await Listing.deleteMany({});
  //added owner property with every listing object
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68031f316054be0551d6345b",
  })); 
  // Insert an array of data (initData.data) into the 'Listing' collection
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

// Call the initDB function to execute the database initialization process
initDB();
 