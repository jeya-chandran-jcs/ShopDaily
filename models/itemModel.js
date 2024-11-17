import mongoose from "mongoose"

const itemSchema= mongoose.Schema({
    name:{type:String,required:true},
    brand:{type:String},
    price:{type:Number,required:true},
    img:{type:String},
    category:{type:String,required:true},
    quantity:{type:Number,default:1}
})

const ItemModel= mongoose.model("item",itemSchema)

export default ItemModel

