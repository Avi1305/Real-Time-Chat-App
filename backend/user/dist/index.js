import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { redisClient } from "./config/redis.js";
import userRoutes from './routes/user.js';
import { connectRabbitMQ } from "./config/rabbitmq.js";
dotenv.config();
connectDb();
connectRabbitMQ();
redisClient
    .connect()
    .then(() => console.log("connected to redis"))
    .catch((e) => console.error(e));
const app = express();
app.use('/api/v1', userRoutes);
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));
//# sourceMappingURL=index.js.map