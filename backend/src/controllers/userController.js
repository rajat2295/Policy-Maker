// login user controller
const loginUser = async (req, res) => {
  res.json({ message: "Login successful" });
};

// signup user controller
const signupUser = async (req, res) => {
  res.json({ message: "User registered successfully" });
};

export { loginUser, signupUser };
