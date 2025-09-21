import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/userRoutes.js";
import passport from "passport";
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { requireJwt , clearCookie } from './authentication/auth.js'
import User from "./models/User.js";
import mongoose from "mongoose";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

connectDb();

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get('/', (req,res) => {
  res.render('index')
})

app.get('/login', (req,res) => {
  res.render('login')
})

app.get('/signup', (req,res) => {
  res.render('signup')
})

app.get('/duplicateUser', (req,res) => {
  res.render('duplicateUser')
})

app.get('/signout', clearCookie ,(req,res) => {
  res.render('signout')
})

app.get('/:email' , requireJwt , async (req,res) => {
  const {email} = req.params;

  
  const user = await User.findOne({email : email})

  // Check if user exists
  if (!user) {
    console.log('User not found');
    return res.status(404).send('User not found');
  }

  const titleId = req.query.titleId;

  let foundNote = {};
  if(titleId){
    const objectId = new mongoose.Types.ObjectId(titleId);
    foundNote = user.notes.find( i =>  i._id.equals(objectId))
  }
  res.render('user' , {user , foundNote})
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
