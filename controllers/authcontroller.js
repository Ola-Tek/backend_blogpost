const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const Token = require("../models/token");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtUtils");
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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    //it will store the refresh token in the Token database for the Token Model
    await Token.create({userid: user._id, token: refreshToken})

    res.status(200).json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: "Server error during signin" });
  }
};

//logic to forget password
exports.forgetPassword = async(req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "The email is invalid"});

     // Generate a reset token
     const resetToken = crypto.randomBytes(20).toString('hex');
     user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
     await user.save();

     // Create reset link
     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; //the  FRONTEND URL Is simply the website address, while reset-password endpoint represent the page the user would have to access to reset the password
     const message = `You requested a password reset. Click the following link to reset your password: ${resetLink}`;
     
     //I used this to log and show the resetlink, so i can temporarily debug. I would update to use a node mailer, so the link can be sent to the mail. but i need create the app address
     console.log('Reset Link:', resetLink);

     res.status(200).json({ message: 'Password reset link sent to your email' });
 } catch (err) {
     res.status(500).json({ error: 'Server error during forgot password' });
 }
};

//logic for resetPassword
exports.resetPassword = async(req, res) => {
  try {
    const {token, newPassword} = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({message: "Invalid or expired token"})

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  }
  catch (err) {
    res.status(500).json({ message: "Server error during reset password"});
  }
};

//Refresh Access Token Logic
exports.refreshAccessToken = async (req, res) => {
  try{
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const tokenDoc = await Token.findOne({ token: refreshToken, userId: decoded.userId})

    if (!tokenDoc)
      return res.status(403).json({ message: "Invalid refresh Token"});

    const newAccessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ accessToken: newAccessToken });
  }catch (err) {
  res.status(403).json({ message: "Invalid or expired refresh token"})
}
};