import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
dotenv.config();
import chatRoutes from './routes/chat.js'
const app = express();

const port = process.env.PORT;
connectDb();

app.use('/api/v1',chatRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
