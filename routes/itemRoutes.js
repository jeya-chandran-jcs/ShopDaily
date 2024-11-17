import express from "express"
import ItemModel from "../models/itemModel.js"

const router=express.Router()

router.post("/additem",async(req,res)=>{
    try{
        const newItem=new ItemModel(req.body)
        await newItem.save()
        res.status(201).json(newItem)
        }
        catch(err){
            res.status(400).json({message:"item not added",error:err.message})
        }
})

router.post("/addmanyitem", async (req, res) => {
    try {
      const items = req.body; // Expecting an array of items
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Expected an array of items" });
      }
  
      const newItems = await ItemModel.insertMany(items); // Bulk insert
      res.status(201).json({
        message: `${newItems.length} items added successfully`,
        items: newItems,
      });
    } catch (err) {
      console.error("Error adding items:", err.message);
      res.status(500).json({ message: "Failed to add items", error: err.message });
    }
  });
  


router.get("/getitem",async(req,res)=>{
    try{
        const item=await ItemModel.find()
        if(!item){
            return res.status(404).json({message:"item is empty"})
        }
        return res.status(200).json(item)
    }
    catch(err){
        res.status(500).json({message:"internal error while fetching item"})
    }
})

router.get("/getitem/:itemId",async(req,res)=>{
    const {itemId}=req.params
    try{
        const singleItem= await ItemModel.findOne({_id:itemId})
        if(!singleItem){
            return res.status(404).json({message:"item not found"})
        }
         return res.status(200).json(singleItem)
    }catch(err){
        return res.status(500).json({message:"server error cant able to find item"})
    }
})

router.get("/search",async(req,res)=>{
  const {query}=req.query
  try{
    const search=await ItemModel.find({
      $or:[{
        name:{$regex:query,$options: 'i'}
        },
         {
        brand:{$regex:query,$options:'i'}
          },
        {
          category:{$regex:query,$options:'i'}
        }]
    })
    if(!search || search.length===0){
      return res.status(404).json({message:"item not found"})
    }

    res.status(200).json(search)

  }
  catch(err){
    return res.status(500).json({message:"internal error while searching"})
  }
})
router.post("/update-item",async(req,res)=>{
  try{
    const updateItems=await ItemModel.updateMany({},{$set:{quantity:1}})
    res.status(200).json({message:"items are updated",updatedItem:updateItems})
  }catch(err){
    return res.status(500).json({message:"internal error while updating items"})
  }
})

export default router