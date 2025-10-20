import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  ref_id: {
    type: String,
    required: true,
    unique: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

authSchema.statics.registerRefId = async function (email, ref_id) {
  // validation
  //   if (!email || !ref_id) {
  //     throw new Error("All fields must be filled");
  //   }
  //   if (ref_id.length !== 6) {
  //     throw new Error("Reference ID must be 6 characters long");
  //   }
  try {
    const existingref = await this.findOne({ ref_id });
    console.log(existingref);
    if (existingref.used === true) {
      throw new Error("Reference id already in used");
    } else if (existingref && existingref.used === false) {
      existingref.used = true;
      existingref.email = email;
      await existingref.save();
      return res.status(200).json({ existingref });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// static method to hash password before saving
authSchema.statics.verifyRefId = async function (ref_id) {
  // validation

  if (ref_id.length !== 8) {
    throw new Error("Reference ID must be 8 characters long");
  }
  const existingref = await this.findOne({ ref_id });
  if (existingref) {
    return { isValid: true }; // if ref id exists and is used by the same email, return true
  } else {
    throw new Error("Reference ID is invalid ");
  }
};
authSchema.statics.exhaustRefId = async function (ref_id, email) {
  // validation

  const existingref = await this.findOne({ ref_id });
  if (existingref && existingref.used === false && !existingref.email) {
    existingref.used = true;
    existingref.email = email;
    await existingref.save();
    return existingref; // if ref id exists and is used by the same email, return true
  }
  throw new Error("Reference ID is invalid or already used");
};
authSchema.statics.verifyEmail = async function (email) {
  // validation
  if (!email) {
    throw new Error("Email must be provided");
  }
  const existingref = await this.findOne({ email });
  if (existingref && existingref.used === true) {
    return { isValid: true }; // if ref id exists and is used by the same email, return true
  }

  throw new Error(
    "User does not exist, please sign up first using a valid Reference ID"
  );
};

// static method to login user

export const Auth = mongoose.model("references", authSchema);
