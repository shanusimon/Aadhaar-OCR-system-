import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./db/dbConnect";
import router from "./routes/router";

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORGINS || "";

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", router);

connectDB();

app.listen(port, () => {
  console.log("Server is running", port);
});
