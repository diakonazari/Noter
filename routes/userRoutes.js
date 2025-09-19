import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { tokenGeneration, requireJwt } from "../authentication/auth.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const userEntry = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    };
    
    const user = new User(userEntry);
    await user.save();
    res.status(201).json({ message: "User created!" });
  } catch (err) {
    if(err?.code === 11000) {
      return res.redirect('/duplicateUser')
    }
    console.error("Error creating user : ", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/noting' , async(req,res) => {
  try{
    const noteData = {
      title : req.body.title,
      note : req.body.note
    }
    const payload = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET);
    console.log(payload);
    
    const email = payload.email;
    await User.findOneAndUpdate({email} , {$push: {notes : noteData}})
    res.redirect(`/${email}`)
  }
  catch(err){
    console.error("Error creating user : ", err);
    res.status(500).json({ error: err.message });
  }
})

router.post("/login", tokenGeneration);

router.get("/protected", requireJwt, (req, res) => {
  res.json({
    ok: true,
    message: "You reached a protected endpoint.",
    user: req.user,
  });
});

export default router;
