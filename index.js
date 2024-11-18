import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.Port || 5000; 
const mongoUrl = process.env.MONGO_URL;

// console.log("MongoDB URL:", mongoUrl);  // Log to verify the value

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use("/user", userRouter);
app.use("/item", itemRoutes);
app.use("/order", orderRoutes);

mongoose.connect(mongoUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error in server connectivity", err);
  });
