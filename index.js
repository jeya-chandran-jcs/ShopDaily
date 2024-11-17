import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes.js"
import itemRoutes from "./routes/itemRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

dotenv.config()
const app=express()
app.use(express.json())
app.use(cors())

const port=process.env.Port
const mongoUrl=process.env.MONGO_URL

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use("/user",userRouter)
app.use("/item",itemRoutes)
app.use("/order",orderRoutes)

mongoose.connect(mongoUrl)
.then(()=>{
    app.listen(port,()=>{console.log(`server is running on port ${port}`)})
})
.catch(()=>{
        console.log("error in server connectivity",err)
    })

