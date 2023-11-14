const router = require("express").Router();
const { Register, Login, Logout } = require("../Controllers/AuthController")
const { NewPost,EditPost,GetPost,GetPostDoc,ProfileData } = require("../Controllers/Post");
const express = require("express");

const app = express();

app.use("/uploads", express.static(__dirname + "/uploads"));


const multer = require("multer");
// const uploadMiddleware = multer({ dest: "uploads/" });
const storage = multer.diskStorage({})
const uploadMiddleware = multer({storage:storage});
 

router.post("/register",Register)
router.post("/login",Login)
router.post("/logout",Logout)

router.get("/profile",ProfileData)
router.post("/post",uploadMiddleware.single("file"),NewPost)
router.put("/post",uploadMiddleware.single("file"),EditPost)
router.get("/post",GetPost);
router.get("/post/:id",GetPostDoc);


module.exports = router;