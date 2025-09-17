import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStraegy , ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';


passport.use(
    {
        usernmmeField : 'email' , passwordField : 'password' , session : false
    },
    async (email , password , done) => {
        try{
            const user  = await User.findOne({email : email})
            if(!user){
                return done(null , false , {message : 'Invalid email or password.'})
            }
            const isMatch = await bcrypt.compare(password , user.password);
            if(!isMatch){
                return done(null , false , {message : 'Invalid email or password.'})
            }
            return done(null , {email: user.email, name: user.firstName})
        }
        catch(err){
            done(err)
        }
    }
)

const JWT_SECRET = process.env.JWT_SECRET;

const tokenGeneration = (req,res,next) => {
    passport.authenticate('local' , {session : false} , (err,user,info) => {
        if(err){
            return next(err)
        }
        if (!user){
            return res.status(401).json({error : 'Unauthorized' , details : info?.message || 'Login Failed'})
        }
        const token = jwt.sign(
            {
                email : user.email , name : user.firstName
            },
            JWT_SECRET
        )
        return res.json(
            {
                token,
                token_type : 'Bearer',
                user
            }
        )
    })(req,res,next)
}