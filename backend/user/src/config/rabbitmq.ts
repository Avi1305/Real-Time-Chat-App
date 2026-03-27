import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASS,
    });

    channel = await connection.createChannel();
    console.log("✅ Connected to rabbitMq");
  } catch (error) {
    console.log("Failed to connect to rabitMQ", error);
  }
};

export const publishToQueue = async (queuename:string,message:any) => {
    if(!channel){
        console.log("rabbit MQ channel is not initialised")
        return;
    }

    await channel.assertQueue(queuename,{durable:true})
    channel.sendToQueue(queuename,Buffer.from(JSON.stringify(message)),{
        persistent:true
    })
}
