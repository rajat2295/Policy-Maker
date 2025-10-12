import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import cors from "cors";
import { connectDB } from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // Adjust the origin as needed
app.use(express.json());
connectDB();
app.use("/api/auth", routes);
app.use("/api/surveys", routes);
app.use("/api/user", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
