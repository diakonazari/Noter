import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/signup' , async (req , res) => {
    try{
        const userEntry = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : await bcrypt.hash(req.body.password , 10)
        }
        const user = new User(userEntry);
        await user.save();
        res.status(201).json({message : 'User created!'});
    }
    catch(err){
        console.error('Error creating user : ' , err);
        res.status(500).json({error : err.message});
    }
})

export default router;