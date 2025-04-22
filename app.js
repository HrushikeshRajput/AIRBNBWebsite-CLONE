if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
//Importing the Express.js library to create a web server
const express = require("express");

//Creating an instance of an Express app to define routes and handle requests
const app = express();

//Importing the Mongoose library to interact with the MongoDB Database
const mongoose = require("mongoose");

// Importing the Listing model, which represents the schema for a database collection
const Listing = require("./models/listing.js");

//Import require path
const path = require("path");

//Import require method-Override
const methodOverride = require("method-override");

//Require ejs-mate package for templating
const ejsMate = require("ejs-mate");

//Require WrapAsync function
const wrapAsync = require("./utils/wrapAsync.js");

//Require ExpressError class
const ExpressError = require("./utils/ExpressError.js");

//Require Schema
const { listingSchema, reviewSchema } = require("./schema.js");

//Require review model
const Review = require("./models/review.js");

//Require listing.js models from routes folder
const listingRouter = require("./routes/listing.js");

//Require review.js models from routes folder
const reviewsRouter = require("./routes/review.js");

//Require user.js models from routes folder
const userRouter = require("./routes/user.js");

//Require session package
const session = require("express-session");

//Require flash package
const flash = require("connect-flash");

//Require passport package
const passport = require("passport");

//Require local strategy
const LocalStrategy = require("passport-local");

//Require user model
const User = require("./models/user.js");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //to parse all data
app.use(methodOverride("_method")); //we use _method in method-Override package
app.engine("ejs", ejsMate); //Includes ejs-mate pacakage to use
//To use static file
app.use(express.static(path.join(__dirname, "/public")));
//Define different session options in variable
const sessionOptions = {
  secret: "mysupersecreatcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//Defining the root route("/") for the web server
//When a GET request is received at "/", respond with a simple message
app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

app.use(session(sessionOptions));
app.use(flash());

//Code for User Authentication
app.use(passport.initialize()); //A middleware that initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //Use to authenticate user means login and signup for user

passport.serializeUser(User.serializeUser()); //User related Information are stored in session
passport.deserializeUser(User.deserializeUser()); //All user related information are remove from session when user logout

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//User rout or User model
// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });

//use listing.js
app.use("/listings", listingRouter);
//use review.js
app.use("/listings/:id/reviews", reviewsRouter);
//use user.js
app.use("/", userRouter);

//page not found error if user visit route that is not define
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

/*//Defining a test route to test the Listing model
//When  a GET request is received at "/testListing", create and save a sample listing
app.get("/testListing", async (req, res) => {
  //Creating a new sample listing with predefined details  
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the beach",
    price: 1200,
    location: "Calanguate, Goa",
    country: "India",
  });
  
  //Saving the sample listing to the databasee
  await sampleListing.save();
  console.log("Sample was saved");
  res.send("successful testing");
}); */
//Defining middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//Starting the Express server on port 8080
app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
