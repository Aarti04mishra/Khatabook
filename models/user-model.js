const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        trim:true,
        minlength:2,
        maxlength:20,
        required:true
    },
    name:{
        type:String,
        trim:true,
        minlength:2,
        maxlength:20,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    hisaab:[{type:mongoose.Schema.Types.ObjectId,ref:"hisaab"}]
})

module.exports=mongoose.model("user",userSchema);

