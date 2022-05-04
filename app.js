//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
const app=express();
const md5 = require("md5");
const bcrypt = require('bcrypt');


const saltRounds = 10;



app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));



mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    Email: String,
    Password: String
});



//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["Password"]}); //this is must be added before the collection

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUserData = new User({
            Email: req.body.username,
            Password: hash
        })
        
        newUserData.save(function(err){
            if(!err)
                res.render("secrets");
            else
                res.send(err);
        });
    });

})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({Email: username},function(err,foundUser){
        console.log(username);
        console.log(foundUser.Password);
        if(err)
            res.send(err);
        else
            if(foundUser)
                bcrypt.compare(password, foundUser.Password, function(err, result) {
                    if(result === true)
                        res.render("secrets");

                });
    });
});

app.listen(3000,function(){
    console.log("successfully connected on port 3000");
});