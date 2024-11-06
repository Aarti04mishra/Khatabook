
const hisaabModel=require("../models/hisaab-model");
const userModel=require("../models/user-model");

module.exports.hisaabPageController=function(req,res){
    res.render("create");
}
module.exports.hisaabController=async function(req,res){
try{
  let {title,description,encrypted,shareable,passcode,editpermissions}=req.body;

  encrypted = encrypted==="on"?true:false;
  shareable = shareable==="on"?true:false;
  editpermissions = editpermissions==="on"?true:false;

  let hisaabCreated=await hisaabModel.create({
      title,
      description,
      user:req.user._id,
      encrypted,
      shareable,
      editpermissions,
      passcode
  })

 let user = await userModel.findOne({email:req.user.email});
 user.hisaab.push(hisaabCreated._id);
 await user.save();

 res.redirect("/profile")
}
catch(err){
  res.send(err.message);
}
}

module.exports.viewHisaabController=async function(req,res){
   try{
    let hisaab=await hisaabModel.findOne({_id:req.params.hisaabid});
    if(hisaab.encrypted){
      res.render("passcode",{id:req.params.hisaabid});
    }
    else{
      res.render("hisaab",{hisaab})
    }
   }
   catch(err){
    res.send(err.message);
   }
}

module.exports.deleteHisaabController=async function(req,res){
try{
  let id=req.params.hisaabId;
  let hisaab =await hisaabModel.findOne({_id:req.params.hisaabId});
  
  if(hisaab.user._id.equals(req.user._id)){
   await hisaabModel.findOneAndDelete({_id:req.params.hisaabId});
   let user=await userModel.findOne({_id:hisaab.user._id});
   let index=user.hisaab.indexOf(req.params.hisaabId);
   if (index !== -1) {
       user.hisaab.splice(index, 1);
       await user.save();

       res.redirect("/profile")
   }
}
else{
 const error=req.flash('error',"You do not have permission to delete this hisaab");
 return res.redirect(`/hisaab/${req.params.hisaabId}/verify`)
}
}
catch(err){
  res.send(err.message);
}

}

module.exports.editHisaabController=async function(req,res){
    
   try{
    let hisaab=await hisaabModel.findOne({_id:req.params.hisaabId});
  
    if((hisaab.user._id.equals(req.user._id))){
        res.render("edit", {
            hisaab
        });
    }
    else if(hisaab.editpermissions){
      let isCreator = hisaab.user.toString() === req.user._id.toString();
      res.render("edit", {
        hisaab,isCreator
    });
    }
   }
   catch(err){
      res.send(err.message)
   }
  
}

module.exports.editController=async function(req,res){
  try{
    let hisaab=await hisaabModel.findOne({_id:req.params.hisaabId})
    let {title,description,encrypted,shareable,passcode,editpermissions}=req.body;
    

    encrypted = encrypted==="on"?true:false;
    shareable = shareable==="on"?true:false;
    editpermissions = editpermissions==="on"?true:false;

    if (hisaab.user.toString() === req.user._id.toString()) {
  
        let updatedHisaab = await hisaabModel.findOneAndUpdate(
          { _id: req.params.hisaabId },
          {
            title,
            description,
            encrypted,
            shareable,
            editpermissions,
            passcode
          },
          { new: true }
        );
        let updatedUser=await userModel.findOneAndUpdate(
          {_id:hisaab.user._id},
          {
            hisaabIndex:req.params._id
          }
        )
        res.redirect("/profile");
  
      } 
    else{
        
        let updatedHisaab = await hisaabModel.findOneAndUpdate(
          { _id: req.params.hisaabId },
          {
            description
          },
          { new: true }
        );
       res.redirect("/profile")
      }
    
  }catch(err){
    res.send(err.message)
  }
}

module.exports.verifyController=async function(req,res){
  let hisaab =await hisaabModel.findOne({_id:req.params.hisaabId});
    if(hisaab.passcode.trim() === req.body.passcode.trim()){
        res.redirect(`/hisaab/${req.params.hisaabId}/verify`)
    }else{
      const error=req.flash('error',"Incorrect Passcode");
     res.redirect(`/hisaab/passcode/${req.params.hisaabId}`)
    }
   
}

module.exports.verifyPageController=async function(req,res){
    const error = req.flash('error'); 
    let hisaab =await hisaabModel.findOne({_id:req.params.hisaabId});
    const isCreator = hisaab.user.toString() === req.user._id.toString();
   
    res.render("hisaab",{hisaab,isCreator, error: error.length > 0 ? error[0] : false})
}

module.exports.passcodePageController=async function(req,res){
 
  const error = req.flash('error'); 
  res.render("passcode",{id:req.params.hisaabId,error:error.length > 0 ? error[0] : false})
}