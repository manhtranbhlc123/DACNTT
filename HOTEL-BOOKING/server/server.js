import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import clerkWebhooks from "./controllers/clerkWebhooks.js";
import { stripeWebhook } from "./controllers/bookingController.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";

import chatbotRoutes from "./routes/chatbotRoutes.js";

import { Webhook } from "svix";
import User from './models/User.js';




// ================= DB =================
connectDB();
connectCloudinary();


// ================= EXPRESS =================
const app = express();


// ================= HTTP SERVER =================
const httpServer = createServer(app);


// ================= SOCKET IO =================
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// ================= CLERK WEBHOOK =================

app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {

    try {

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      const evt = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });

      console.log("Webhook Event:", evt.type);

      if (evt.type === "user.created") {

        const { id, first_name, last_name, email_addresses, image_url } = evt.data;

        const newUser = new User({
          _id: id,
          username: `${first_name || ""} ${last_name || ""}`.trim(),
          email: email_addresses[0].email_address,
          image: image_url,
          recentSearchedCities: []
        });

        await newUser.save();

        console.log("✅ User saved");
      }

      res.status(200).json({
        success: true
      });

    } catch (err) {

      console.log(err.message);

      res.status(400).json({
        success: false
      });
    }
  }
);



// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {

    console.log("✅ User connected:", socket.id);

    socket.on("user_message", (msg) => {

        console.log("📩 USER:", msg);

        io.emit("admin_receive", msg);
    });

    socket.on("admin_reply", (data) => {

        console.log("📨 ADMIN:", data);

        io.emit("user_receive", data);
    });

    socket.on("disconnect", () => {

        console.log("❌ User disconnected");
    });
});


// ================= PORT =================
const PORT = process.env.PORT || 5000;


// ================= CORS =================
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "clerk-db-jwt"
    ],
    credentials: true
}));


// ================= WEBHOOK =================
app.post(
    "/api/bookings/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);


// ================= MIDDLEWARE =================
app.use(express.json());

app.use(clerkMiddleware());


// ================= ROUTES =================

app.use("/api/user", userRouter);

app.use("/api/hotels", hotelRouter);

app.use("/api/rooms", roomRouter);

app.use("/api/bookings", bookingRouter);

app.use("/api/offers", offerRoutes);

app.use("/api/chat", chatbotRoutes);


// ================= TEST =================
app.get("/", (req, res) => {

    res.send("TL-Stay Server Running");
});


// ================= START =================
httpServer.listen(PORT, () => {

    console.log(
        `🔥 Server running on port ${PORT}`
    );
});


