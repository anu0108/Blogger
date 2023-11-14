const dotenv = require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.Register = async(req,res)=>{
    const { username, password } = req.body;
    const user = await User.findOne({ username });
  
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const userDoc = await User.create({ username, password: hashedPassword });
      res.json(userDoc);
    } catch (e) {
      res.status(400).json(e);
    }
}

module.exports.Login = async(req,res)=>{
    const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(400).json({ message: "User doesn't exists" });
  }
  const isPasswordValid = await bcrypt.compare(password, userDoc.password);

  if (isPasswordValid) {
    //logged in
    const token = jwt.sign({ username, id: userDoc._id }, process.env.JWT_SECRET_KEY,{
      expiresIn: 3*24*60*60,
    });
    res.cookie("token", token, {
      maxAge:1000*60*60*24*3, 
      withCredentials: true,
      httpOnly: true,
      secure: true,
      sameSite:'none',
    })
    return res.status(200)
    .json("logged in "); 
  } else {
    res.status(400).json("wrong credentials");
  } 
}

module.exports.Logout = async(req,res)=>{
    res.cookie("token", "").json("ok");
}