import express from "express";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../controllers/baseController.js";
import { loginUser, signupUser } from "../controllers/userController.js";

const router = express.Router();
// CRUD routes
router.get("/", getData);
router.post("/", postData);
router.put("/:id ", putData);
router.delete("/:id", deleteData);
// login route
router.post("/login", loginUser);
router.post("/signup", signupUser);

export default router;
