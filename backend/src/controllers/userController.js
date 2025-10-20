import { User, createToken } from "../models/userModel.js";
import { Auth } from "../models/authModel.js";
// login user controller
const signupWithGoogle = async (req, res) => {
  const { refId, email } = req.body;

  try {
    await Auth.verifyRefId(refId);
    const auth = await Auth.exhaustRefId(refId, email);
    const token = createToken(auth._id);
    res.status(200).json({ email, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  //   res.json({ message: "User registered successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// signup user controller
const signupUser = async (req, res) => {
  const { email, password, refId } = req.body;
  try {
    await Auth.verifyRefId(refId);
    await Auth.exhaustRefId(refId, email);
    const user = await User.signup(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  //   res.json({ message: "User registered successfully" });
};
const signupUserWithGoogle = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  //   res.json({ message: "User registered successfully" });
};
const verifyRefId = async (req, res) => {
  const { refId } = req.body;
  try {
    const auth = await Auth.verifyRefId(refId);
    res.status(200).json({ isValid: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const auth = await Auth.verifyEmail(email);
    const token = createToken(auth._id);
    res.status(200).json({ email, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { loginUser, signupUser, verifyRefId, verifyEmail, signupWithGoogle };
