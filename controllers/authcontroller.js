const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
//const sendEmail = require("../utils/sendEmail"); I would uncomment this when i am working on my forget password feature, i would have to create a utility folder for this
//Note: Controller file is the logic behind each route

//The Logic for registering the candidate or User
//Exporting the signup and signin logic so it can be used in the routes file
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; //This req.body usually comes from a POST method, it extracts the username, email and password, all which are field required to get registered

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    //we could have hashed the pssword, but it has already been hashed in the model, so no need to duplicate it in the authentication column

    // Create user
    const user = await User.create({ username, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup" });
  }
};


//The Logic for signing in
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) 
        return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) 
        return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, // I generated the JWT_SECRET by using the following code: node -e "console.log(require('crypto').randomBytes(64).tostring('hex'))"
        { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error during signin" });
  }
};

