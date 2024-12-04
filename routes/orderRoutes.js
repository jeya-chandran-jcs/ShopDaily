import express from "express"
import OrderModel from "../models/orderModel.js"
import authMiddleware from "../authentication/authMiddleware.js"
import UserModel from "../models/userModel.js"
import {sendMail} from "../nodemaile.js"

const router= express.Router()

router.post("/orderitem",authMiddleware,async(req,res)=>{
    const userId=req.user.id
    
    try{
        const order= await new OrderModel({...req.body,customerId:userId,deliveryStatus:"Arriving soon"})
       
        await order.save()
        res.status(201).json({message:"successfully items are added",orders:order,ordersId:order._id,customeName:userId.name})
    }
    catch(err){
        return res.status(500).json({message:"internal error while ordering items"})
    }
})


router.get("/order/:orderid",authMiddleware,async(req,res)=>{
    const {orderid}=req.params
    try{
        const findOrder= await OrderModel.findById(orderid)
        if(!findOrder){
            return res.status(404).json({message:"order not found"})
        }

        res.status(200).json({message:"order successfully found and sent",order:findOrder})

    }
    catch(err){
        return res.status(500).json({message:"internal error while fetching the orders id"})
    }
})

router.get("/generate-bill/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await OrderModel.findById(id).populate("orderItems").populate("customerId"); // Populate both
        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        console.log("bill", bill.orderItems);

        const user = await UserModel.findById(bill.customerId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("user", user.name);

        // Calculate customer bill with populated items
        const customerBill = bill.orderItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;  // Assuming each item has 'price' and 'quantity'
        }, 0);

        console.log("customer Bill", customerBill);

        // Generate the bill
        const generateBill = {
            billId: bill._id,
            customerName: user.name,
            customerAddress: bill.deliveryAddress, // Ensure 'address' exists in user model
            orderedItems: bill.orderItems.map(item => ({
                itemName: item.name,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.quantity * item.price
            })),
            phoneNumber:bill.phone,
            paymentType: bill.paymentType,
            totalPrice: customerBill,
            orderDate: bill.orderDate,
            deliveryStatus: bill.deliveryStatus  // Accessing directly from bill
        };

        const mailOption=`
        <div style="border: 3px solid black; padding:10%; max-width:600px;  font-family:Arial; sans-serif; color: #333;">
            <h1 style="text-align:center; color:#007BFF; ">Bill from shopdaily</h1>
            <h3>Bill details :</h3>
            <p style="margin:10px 0;"><strong>Name</strong> ${user.name}</p>
            <p style="margin 10px 0 "><strong>ph-no</strong> : ${bill.phone}</p>
            <p style="margin 10px 0 "><strong>address </strong> ${bill.address}</p>
            <h3 style="margin 10px 0 "><strong>items</strong></h3> 
            
                   <table style="border 2px solid black; border-collapse: collapse; text-align: left; width: 100%">
                        <thead>
                        <tr >
                        <th style="border 1px solid black; padding: 8px;">name</th>
                        <th style="border 1px solid black; padding: 8px;">price</th>
                        <th style="border 1px solid black; padding: 8px;">quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${bill.orderItems.map((item)=>`
                        <tr style="border 1px solid black">
                            <td style="border 1px solid black">${item.name}</td>
                            <td style="border 1px solid black">₹${item.price}</td>
                            <td style="border 1px solid black">${item.quantity}</td>
                        </tr>`
                        ).join("")}
                        
                        </tbody>
                        </table>
            
            <p style="margin 10px 0; font-weight: bold;"><strong>total price</strong> ${customerBill}</p>
            <p style="margin 10px 0 "><strong>payment type</strong> ${bill.paymentType}</p>
            <p style="margin 10px 0; font-weight: bold; color:red;"><strong>Delivery status</strong> ${bill.deliveryStatus}</p>
            <h3 style="text-align:center; margin:20px">thank you for shopping from<b>shopdaily !!</b> ,Have a nice day</h3>
         </div>   
            `
            sendMail(user.email,"ShopDaily confirmation Bill " ,mailOption)
        console.log("generate bill", generateBill);
        res.status(200).json({ message: "Bill successfully generated", bill: generateBill });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error while generating bill" });
    }
});
export default router