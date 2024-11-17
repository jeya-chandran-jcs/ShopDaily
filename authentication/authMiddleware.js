import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function (req,res,next){
    const token=req.headers.authorization
    if(!token){
        console.log("token is not provided")
    return res.status(401).json({msg:"token not provided"})
    }
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