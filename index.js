import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/userRoutes.js";
import passport from "passport";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

connectDb();

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
