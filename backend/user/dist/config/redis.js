import dotenv from 'dotenv';
dotenv.config();
import { createClient } from 'redis';
const redis_url = process.env.REDIS_URL;
if (!redis_url) {
    throw new Error("Redis url is not defined in environment variable");
}
export const redisClient = createClient({
    url: redis_url
});
//# sourceMappingURL=redis.js.map