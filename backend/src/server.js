import express from "express";
import routes from "./routes/routes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
connectDB();
app.use("/api/", routes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
