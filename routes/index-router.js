const express=require('express');
const router=express.Router();

const {landingPageController,registerPageController,registerController,loginController,logoutController,profileController}=require("../controllers/index-controller")
const {isloggedin,redirectIfLoggedIn}=require("../middlewares/auth-middlewares")

router.get("/",redirectIfLoggedIn,landingPageController);
router.get("/register",redirectIfLoggedIn,registerPageController);
router.get("/logout",logoutController)
router.get("/profile",isloggedin,profileController)

router.post("/register",registerController);
router.post("/login",loginController)


module.exports=router;