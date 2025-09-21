import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { tokenGeneration, requireJwt } from "../authentication/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
    res.status(201).redirect('/login');
  } catch (err) {
    if (err?.code === 11000) {
      return res.redirect("/duplicateUser");
    }
    console.error("Error creating user : ", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/noting", requireJwt, async (req, res) => {
  try {

    const { titleId } = req.query;

    
    

    const noteData = {
      title: req.body.title,
      note: req.body.note,
    };
    const payload = jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET
    );
    const email = payload.email;
    if (titleId) {
      const objectId = new mongoose.Types.ObjectId(titleId);
      
      await User.findOneAndUpdate(
        { email, "notes._id": objectId },
        {
          $set: {
            "notes.$.title": noteData.title,
            "notes.$.note": noteData.note,
          },
        }
      );
      res.redirect(`/${email}`);
    } 
     else {
      await User.findOneAndUpdate({ email }, { $push: { notes: noteData } });
      res.redirect(`/${email}`);
    }
  } catch (err) {
    console.error("Error creating user : ", err);
    res.status(500).json({ error: err.message });
  }
});



router.get("/delete", requireJwt, async (req, res) => {
  try {
    const { titleId, del } = req.query;
    console.log(' these are titleId, del : ' , titleId, del);
    const payload = jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET
    );
    const email = payload.email;
   
   if(titleId && del === "1"){
      const objectId = new mongoose.Types.ObjectId(titleId);
      console.log('********************** WE ARE IN THE FUNCTION ***********************');
      
      await User.findOneAndUpdate({email} , {$pull : { notes : {
        _id : objectId
      }}})
      res.redirect(`/${email}`);
    }
  } catch (err) {
    console.error("Error creating user : ", err);
    res.status(500).json({ error: err.message });
  }
});




router.post("/login", tokenGeneration);

router.get("/protected", requireJwt, (req, res) => {
  res.json({
    ok: true,
    message: "You reached a protected endpoint.",
    user: req.user,
  });
});

export default router;
