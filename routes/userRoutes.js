import UserModel from "../models/userModel.js"
import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {sendMail} from "../nodemaile.js"
import crypto from "crypto"
import authMiddleware from "../authentication/authMiddleware.js"

dotenv.config()

const router=express.Router()

router.post("/register",async(req,res)=>{
    const {name,email,password}=req.body
    try{
      const isUserExist = await UserModel.findOne({email})
      if (isUserExist){
        return res.status(400).json({message:"user already exist"})
      }
      const hashedPassword= await bcrypt.hash(password,10)
      const newUser= new UserModel({...req.body,password:hashedPassword,verified:true})
      console.log(newUser)
      await newUser.save()

      res.status(201).json({message:"user registered successfully"})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const passwordMatch=await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(404).json({message:"password doesnt match"})
        }
        const token=jwt.sign({id:user._id},process.env.JWT,{expiresIn:"1h"})
        console.log("token >>>> ",token)
        return res.status(200).json({message:"login successfully",token})
        
    }
    catch(err){
        console.log("login error")
        res.status(401).json({message:"error in login"})
    }
})

router.post("/forget-password",async(req,res)=>{
    const {email}=req.body
    try{
        const user= await UserModel.findOne({email})
        if(!user){
            return res.status(404).json({message:"invalid email"})
        }
        const resetToken= crypto.randomBytes(32).toString("hex")
        console.log("reset token >>>>",resetToken)
        user.resetPasswordToken=resetToken
        await user.save()

        const resetLink=`https://localhost:3000/user/reset-password/${resetToken}`
        const mailOption=`
        <h1>Password reset request</h1>
        <p><b>click the link below to reset your password:</b></p>
        <a href="${resetLink}" target="_blank">Reset password </a>
        `
        try{
            const mail=  await sendMail(email,"Password Reset Request",mailOption)
            console.log("mail sent successfully")
            res.status(200).json({message:"password reset request has been sent"})
        }catch(err){
            console.log("error in sending mail")
            res.status(500).json({message:"error in sending mail"})
        }
    }
    catch(err){
        res.status(500).json({message:"error in forget password"})
    }

})

router.post("/reset-password/:resetToken",async(req,res)=>{
    const {resetToken}=req.params
    const {newPassword}=req.body

    try{
        const user=await UserModel.findOne({resetPasswordToken:resetToken})
        if(!user){
            return res.status(404).json({message:"invalid token from  reet password"})
        }
        const hashedPassword=await bcrypt.hash(newPassword,10)
        user.password=hashedPassword
        user.resetPasswordToken=null
        await user.save()

        res.status(200).json({message:"password reset successfully"})
    }
    catch(err){
        res.status(500).json({message:"error in reset password"})
    }
})

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming the token contains user.id
        const user = await UserModel.findById(userId);  // Find user by _id (not _userId)
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
 
        res.status(200).json({ user });
    } catch (err) {
        console.log("Can't get user profile", err);
        res.status(500).json({ message: "Error in getting user profile" });
    }
 });

export default router