const express=require('express');
const router=express.Router();

const{hisaabPageController,hisaabController,viewHisaabController,
    deleteHisaabController,editHisaabController,editController,verifyController,verifyPageController,passcodePageController}=require("../controllers/hisaab-controller")
const {isloggedin,redirectIfLoggedIn}=require("../middlewares/auth-middlewares")

router.get("/create",isloggedin,hisaabPageController)
router.post("/create",isloggedin,hisaabController);
router.get("/view/:hisaabid",isloggedin,viewHisaabController)
router.get("/delete/:hisaabId",isloggedin,deleteHisaabController);
router.get("/edit/:hisaabId",isloggedin,editHisaabController);
router.post("/edit/:hisaabId",isloggedin,editController)
router.post("/:hisaabId/verify",isloggedin,verifyController)
router.get("/:hisaabId/verify",isloggedin,verifyPageController)
router.get("/passcode/:hisaabId",isloggedin,passcodePageController)

module.exports=router;