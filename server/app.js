const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const http = require("http");
// Load environment variables
require("dotenv").config();
// Connect to database
const db = require("./db/mongoose");

// Create express app and add middlewares
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT || "http://localhost:5173", // Allow the frontend origin
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a secure key or an environment variable
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Doesn't save empty sessions
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    }, // Set to true if using HTTPS in production
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }), // Use MongoDB for sessions
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());

// Middleware for error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server error");
});

const routes = require("./routes");
app.use("/api", routes);

// Test routes

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server and Socket.io are running on port ${PORT}`);
});
