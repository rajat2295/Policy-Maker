import express from "express";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../controllers/baseController.js";

const router = express.Router();

router.get("/", getData);
router.post("/", postData);
router.put("/:id ", putData);
router.delete("/:id", deleteData);

export default router;
