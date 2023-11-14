const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const port = process.env.PORT || 4000;
const authRoute = require("./Routes/Route");

const app = express();

app.use(cors({ credentials: true, 
  origin: process.env.FRONTEND_LINK, 
  // origin: "https://blogger-n99b.vercel.app", 
})); 
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lunza1v.mongodb.net/`
);

app.get("/", (req, res) => {
  res.send("Hello, this is the root route!");
});

app.use("/", authRoute); 
 

app.listen(4000, () => {
  console.log("Server is running on Port 4000");
});
