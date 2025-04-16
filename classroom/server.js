const express = require("express");
const app = express();
//require users.js and posts.js
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
//require express session
const session = require("express-session");
//require flash package
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

//variable to store session options
const sessionOptions = {
  secret: "mysupersecreatstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register",(req,res)=>{
  let {name ="anonymous"}=req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error","User Not Registered!");
  }else{
    req.flash("success","user registered successfully!");
  }
  
  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
  res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
});
// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count}times`);
// });

app.listen(3000, () => {
  console.log("server is listening to 3000");
});
