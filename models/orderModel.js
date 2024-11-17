import mongoose from "mongoose"

const orderSchema= mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    totalPrice: {type: Number, required: true},
    orderItems: [{type: mongoose.Schema.Types.ObjectId, ref: "item"}],
    orderDate: {type: Date, default: Date.now},
    isDelivered: {type: Boolean, default: false},
    deliveryAddress: {type: String, required: true},
    deliveryStatus: {type: String, default: "Pending"},
    paymentType:{type:String,required:true},
    phone:{type:Number,required:true}
})

const OrderModel=mongoose.model("order",orderSchema)

export default OrderModel