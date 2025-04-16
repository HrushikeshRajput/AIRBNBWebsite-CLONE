const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Reruire passport-local-mongoose library
const passportLocalMongoose = require("passport-local-mongoose");

//Defining schema for user
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);
//Exporting User model
module.exports = mongoose.model("User",userSchema);