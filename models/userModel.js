import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    userId:{type:String},
    resetPasswordToken:{type:String,default:null},
    resetPasswordExpires:{type:Date,default:null},
    verified:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
    

})

const UserModel= mongoose.model("user",userSchema)

export default UserModel