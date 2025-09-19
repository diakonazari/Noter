import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStraegy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }
        return done(null, { email: user.email, name: user.firstName });
      } catch (err) {
        done(err);
      }
    }
  )
);

const JWT_SECRET = process.env.JWT_SECRET;

export const tokenGeneration = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        details: info?.message || "Login Failed",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        name: user.firstName,
      },
      JWT_SECRET
    );
    return (
      res.cookie('access_token', token, {
          httpOnly: true,
          secure : false,
          sameSite  : 'Lax',
          path : '/'
      })
      .redirect(`/${user.email}`)
    );
  })(req, res, next);
};
const cookieExtractor = (req) => req?.cookies?.access_token || null;

passport.use(
  new JwtStraegy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
      return done(null, { email: payload.email, name: payload.name });
    }
  )
);

export const requireJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(500).json({
        error: "Unauthorize",
        details: info?.message || "Invalid Token!",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const clearCookie = (req, res, next) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  next();
};
