const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const http = require("http");
// Load environment variables
require("dotenv").config();

// Create express app and add middlewares
const app = express();
const server = http.createServer(app);

const allowedOrigins = [process.env.CLIENT, process.env.CLIENT2];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// Middleware for error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server error");
});
app.get("/", (req, res) => {
  res.send(`<h1>Saraswati Academy</h1><br>
    
    ${process.env.CLIENT}
    `);
});
const routes = require("./routes/routes");
app.use("/api", routes);

// Test routes

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server and Socket.io are running on port ${PORT}`);
});
