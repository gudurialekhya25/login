require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true }, { useUnifiedTopology: true });

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const userModel = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/register", function(req, res) {
  const newUser = new userModel({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if(!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});

app.post("/login", function(req, res) {
  userModel.findOne({email: req.body.username}, function(err, result) {
    if(!err) {
      if(result.password === req.body.password) {
      res.render("secrets");
    } else {
      res.send("wrong password");
    }
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});
