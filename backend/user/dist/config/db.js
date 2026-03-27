import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const connectDb = async () => {
    const url = process.env.MONGO_URI;
    console.log(url);
    if (!url) {
        throw new Error("Mongo_uri is not defined in environment variables");
    }
    try {
        await mongoose.connect(url, {
            dbName: "ChatappmicroserviceApp"
        });
        console.log("connected to mongoDb");
    }
    catch (error) {
        console.error("Failed to connect to mongoDb", error);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map