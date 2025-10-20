import express from "express";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../controllers/baseController.js";
import {
  loginUser,
  signupUser,
  verifyRefId,
  verifyEmail,
  signupWithGoogle,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/verifyrefid", verifyRefId);
router.post("/verifyemail", verifyEmail);
router.post("/google-signup", signupWithGoogle);

// protected routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

router.use(requireAuth);
// CRUD routes
router.get("/", getData);
router.post("/", postData);
router.put("/:id ", putData);
router.delete("/:id", deleteData);
// login route

export default router;
