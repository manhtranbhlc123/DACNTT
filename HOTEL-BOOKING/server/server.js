import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import { stripeWebhook } from "./controllers/bookingController.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import { getAIReply } from "./AI/ai.js";

connectDB();
connectCloudinary();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "clerk-db-jwt"],
    credentials: true
}));

app.post("/api/bookings/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use(clerkMiddleware());

// app.post("/chat", async (req, res) => {
//     try {
//         const message = req.body?.message;
//         const reply = await getAIReply(message);
//         res.json({ reply });
//     } catch (err) {
//         res.json({ reply: "Loi AI hoac thieu API key" });
//     }
// });

// app.get("/", (req, res) => {
//     res.send("Chatbot dang chay");
// });

// app.get("/test", (req, res) => {
//     res.json({ message: "Test OK" });
// });

app.use("/api/clerk", clerkWebhooks);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/offers", offerRoutes);

app.listen(PORT, () => {
    console.log("CLERK_SECRET_KEY set:", !!process.env.CLERK_SECRET_KEY);
    console.log(`Server running on port ${PORT}`);
});
