const dotenv = require("dotenv").config();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

module.exports.ProfileData = async(req,res) =>{
    const { token } = req.cookies;
    // console.log(token)
  //   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, info) => {
  //   if (err) throw err;
  //   res.json(info);
  // });
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, info) => {
      if (err){ 
        console.error(err);
        res.status(401).json({ message: 'Invalid token' }); 
      } 
      // throw err;
      res.json(info); 
    });
  } else {
    // Handle the case where the token is not set
    res.status(401).json({ message: 'Token not provided' });
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    // resource_type: "auto",
    folder:'Blogger',
  });
  return res;
}


module.exports.NewPost = async(req,res) =>{
  //   const { originalname, path } = req.file; 
  // const parts = originalname.split(".");
  // const ext = parts[parts.length - 1]; 
  // const newPath = path + "." + ext; 
  // fs.renameSync(path, newPath);
  // console.log("newPath", newPath);
  const imageFilePath = req.file.path;
  const cldRes = await handleUpload(imageFilePath);

  const { token } = req.cookies;
   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({ 
      title,
      summary,
      content,
      // cover: newPath,
      cover:cldRes.secure_url,
      author: info.id,
    });
    res.json({ postDoc });
  });
}

module.exports.EditPost = async(req,res) =>{
    let newPath = null;
  // if (req.file) {
  //   const { originalname, path } = req.file;
  //   const parts = originalname.split(".");
  //   const ext = parts[parts.length - 1];
  //   newPath = path + "." + ext;
  //   fs.renameSync(path, newPath);
  // }

  const { token } = req.cookies;
  // console.log('Token:', token);
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    console.log('Decoded Token:', info);
    const { id, title, summary, content } = req.body;
    const imageFilePath = req.file ? req.file.path : null;

    let cldRes = null;
    if (imageFilePath) {
      cldRes = await handleUpload(imageFilePath);
    }

    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      // cover: newPath ? newPath : postDoc.cover,
      cover: imageFilePath ? cldRes.secure_url : postDoc.cover,
    });

    res.json(postDoc);
  });

}


module.exports.GetPost = async(req,res) =>{
    res.json(
        await Post.find()
          .populate("author", ["username"])
          .sort({ createdAt: -1 })
          .limit(20)
      );
}

module.exports.GetPostDoc = async(req,res) =>{
    const { id } = req.params;
  postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
}

