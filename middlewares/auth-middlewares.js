const jwt=require('jsonwebtoken');
const userModel=require("../models/user-model")
module.exports.isloggedin=async function(req,res,next){
if(req.cookies.token){
    try{
        let decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user= await userModel.findOne({email:decoded.email})
        req.user=user;
        next()
    }
    catch(err){
       res.send(err.message)
    }
}
else{
  res.redirect("/")
}

}

module.exports.redirectIfLoggedIn=function(req,res,next){
if(req.cookies.token){
    try{
        let decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY);
        req.user=decoded;
        res.redirect("profile")
    }
    catch(err){
      return next();
    }
}
else{
   return next();
}

}