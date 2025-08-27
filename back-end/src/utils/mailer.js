// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail", // or Outlook / Yahoo / Hotmail if needed
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"MyApp Security" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}
