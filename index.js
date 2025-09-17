import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/userRoutes.js";
import passport from "passport";
import path from 'path';
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
