import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
export const requireAuth = async (req, res, next) => {
  // verify authentication here
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  // Bearer token
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById({ _id }).select("_id");
    next(); // proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Request is not authorized" });
  }
};
