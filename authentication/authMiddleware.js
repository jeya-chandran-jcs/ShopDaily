import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function authMiddleware (req,res,next){
    const authHeader=req.headers.authorization 
  
    if(!authHeader){
        console.log("token is not provided")
    return res.status(401).json({msg:"token not provided"})
    }
    console.log(authHeader)
    const token= authHeader.split(" ")[1]
  
    console.log(token)
    try{
        const decoded= jwt.verify(token,process.env.JWT)
        req.user=decoded
        console.log(req.user)
        next()
        // if token is valid, req.user will contain the user object
    }
    catch(err){
        console.error(err.message)
        res.status(401).json({msg:"server error & in authmiddleware"})
    }

}