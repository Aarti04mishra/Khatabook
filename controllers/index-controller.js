const userModel=require('../models/user-model');
const hisaabModel=require('../models/hisaab-model');
const bcrypt = require('bcryptjs');

const jwt=require("jsonwebtoken")
module.exports.landingPageController=function(req,res){
    const error = req.flash('error');
    res.render("index", {
        loggedin: false,
        error: error.length > 0 ? error[0] : false
    });
}

module.exports.registerPageController=function(req,res){
  const error = req.flash('error');
    res.render("register",{
      loggedin: false,
      error:error.length > 0 ? error[0] : false
    });
}

module.exports.registerController=async function(req,res){
 try{
    
    const {username,name,email,password}=req.body;
   
    let user=await userModel.findOne({email});
    
    if(user){
      req.flash('error', 'you already have an account.');
      return res.redirect("/register")
    }
    const salt=await bcrypt.genSalt(10);
    const hashed=await bcrypt.hash(password,salt)
    user=await userModel.create({
        name,
        email,
        username,
        password:hashed
    });
   
    let token =jwt.sign({id:user._id,email:user.email},process.env.JWT_KEY);
    res.cookie("token",token);
    res.redirect("/profile")
 }
 catch(err){
    console.log(err.message)
 }
}

module.exports.loginController=async function(req,res){
try{
  const {email,password}=req.body;
   
  let user=await userModel.findOne({email}).select("+password");
  if(!user){
   
    req.flash('error', 'User not found. Please check your email.');
    return res.redirect('/');
  }
  
  let result= await bcrypt.compare(password,user.password);
  
  if(result){
    let token =jwt.sign({id:user._id,email:user.email},process.env.JWT_KEY);
    res.cookie("token",token);
    res.redirect("/profile")
  }
  else{
    req.flash('error', 'Incorrect password. Please try again.');
    res.redirect('/');
  }
}
catch(err){
  res.send(err.message);
}
}

module.exports.logoutController=function(req,res){
    res.cookie("token","");
    return res.redirect("/")
}

module.exports.profileController=async function(req,res){
try{
  let byDate=Number(req.query.byDate);
  let {startDate,endDate}=req.query;

  byDate=byDate ? byDate : -1;
  startDate=startDate ? startDate : new Date("2022-01-01")
  endDate= endDate ? endDate : new Date()
 

  let user=await userModel.findOne({email:req.user.email}).populate({
    path:"hisaab",
    match:{createdAt:{$gte: startDate, $lte:endDate}},
    options:{sort:{createdAt:byDate}}
  });
   res.render("profile",{user})
}
catch(err){
  res.send(err.message);
}
}