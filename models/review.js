//require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define review schema
const reviewSchema = new Schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    creatAt:{
        type:Date,
        default:Date.now(),
    },
});
module.exports = mongoose.model("Review", reviewSchema);