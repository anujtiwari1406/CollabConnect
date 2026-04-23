const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

// Route imports
const authRoutes = require("./routes/authRoutes");
const brandRoutes = require("./routes/brandRoutes");
const influencerRoutes = require("./routes/influencerRoutes");
const matchRoutes = require("./routes/matchRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const deliverableRoutes = require("./routes/deliverableRoutes");
const collabRoutes = require("./routes/collabRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully to Atlas"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/influencer", influencerRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/deliverable", deliverableRoutes);
app.use("/api/collab", collabRoutes);


// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Collaborator Backend is running" });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("send_message", (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
