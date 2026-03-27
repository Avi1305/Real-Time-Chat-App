import amqp, { connect, type Message } from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASS,
    });

    let channel = await connection.createChannel();
    const queuename = "send-otp";
    await channel.assertQueue(queuename, { durable: true });

    console.log("✅ Mail service consumer started or listening for otp emails");
    channel.consume(queuename, async (msg) => {
      if (!msg || !msg.content) {
        console.warn("Received empty message or content for send-otp queue");
        return;
      }

      try {
        const { to, subject, body } = JSON.parse(msg.content.toString());

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: "Chat App",
          to,
          subject,
          text: body,
        });

        console.log(`otp mail sent to ${to}`);
        channel.ack(msg);
      } catch (error) {
        console.error("Failed to process OTP mail message", error);
      }
    });
  } catch (error) {
    console.log("Failed to start consumer rabbitmq", error);
  }
};
