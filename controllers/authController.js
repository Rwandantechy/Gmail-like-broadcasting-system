const { validationResult } = require("express-validator");
const db = require("../database.js");
const ejs = require("ejs");
const {
  doesEmailExist,
  doesUsernameExist,
  generateOTP,
} = require("../middleWares/reusableFunctions/functions.js");
const {
  generateAuthToken,
} = require("../middleWares/reusableFunctions/jwtAuth.js");
const {
  hashInputData,
  comparePasswords,
} = require("../middleWares/passwordHashing.js");
const mailer = require("../middleWares/emailSenderconfig.js");
const path = require("path");
const fs = require("fs").promises;
const process = require("process");

// Create a centralized error handling function
const handleError = (res, message) => {
  console.error("Error:", message);
  res.status(500).render("signup", { message });
};

// Function to send verification email
const sendVerificationEmail = async (email, otp) => {
  try {
    const emailTemplatePath = path.join(__dirname, "../views/verify-email.ejs");
    const emailTemplateContent = await fs.readFile(emailTemplatePath, "utf8");
    const emailContent = ejs.render(emailTemplateContent, { otp: otp });

    const mailOptions = {
      from: process.env.SENDING_MAIL,
      to: email,
      subject: "OTP for email verification",
      html: emailContent,
    };

    await mailer.transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Signup controller function
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "error", errors: errors.array() });
    }

    var { username, email, password, cpassword, firstname, lastname } =
      req.body;

    if (password !== cpassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    const emailExist = await doesEmailExist(email);
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExist = await doesUsernameExist(username);
    if (usernameExist) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await hashInputData(password);

    const insertQuery =
      "INSERT INTO users (username, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)";
    const insertData = [username, email, hashedPassword, firstname, lastname];

    const [userResult, userFields] = await db.query(insertQuery, insertData);

    const otp = generateOTP();
    const currentTime = new Date();

    const expireTime = new Date(new Date().getTime() + 60 * 60 * 1000);

    const otpInsertData = [
      userResult.insertId,
      email,
      otp,
      currentTime,
      expireTime,
    ];

    const insertOtpQuery =
      "INSERT INTO otps (userid, email, sentotp, created_at, expire_at) VALUES (?, ?, ?, ?, ?)";

    // Execute the SQL query with the formatted Date strings
    await db.query(insertOtpQuery, otpInsertData);

    // Send verification email
    await sendVerificationEmail(email, otp);

    return res.status(302).render("signup-success", { email: email });
  } catch (error) {
    handleError(res, "Error signing up: " + error.message);
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, first, second, third, fourth, fifth, sixth } = req.body;
    const otp = first + second + third + fourth + fifth + sixth;
    console.log(`otp  is ${otp} and its type is ${typeof otp}`);
    // Check if email exists in the users table
    const userQuery = "SELECT * FROM users WHERE email = ?";
    const [userResult, userFields] = await db.query(userQuery, [email]);

    if (!userResult.length) {
      // Redirect to signup page if email does not exist in the users table
      return handleVerificationFailure(
        res,
        email,
        "This email is not registered with  us."
      );
    }

    const otpQuery = "SELECT * FROM otps WHERE email = ?";
    const [otpResult, otpFields] = await db.query(otpQuery, [email]);

    if (!otpResult.length || !isValidOtp(otpResult[0], otp)) {
      // Redirect to signup page if OTP is invalid or not found in the otps table
      return handleVerificationFailure(res, email, "Invalid OTP.");
    }

    // Check if emailverified status is 0
    if (userResult[0].emailverified === 0) {
      // Redirect to signup page if email is not verified
      return handleVerificationFailure(res, email, "Email is not verified.");
    }

    // Update emailverified status to 1
    const updateQuery = "UPDATE users SET emailverified = 1 WHERE email = ?";
    await db.query(updateQuery, [email]);

    // Delete the OTP row from otps table
    const deleteOtpQuery = "DELETE FROM otps WHERE email = ?";
    await db.query(deleteOtpQuery, [email]);

    // Redirect to login page after successful verification
    return res.status(302).render("otp-success");
  } catch (error) {
    // Handle errors and log detailed information
    handleError(res, "Error verifying OTP: " + error.message);
  }
};

// Helper function to handle verification failure
const handleVerificationFailure = async (res, email, errorMessage) => {
  try {
    // Delete the user from users table
    const deleteUserQuery = "DELETE FROM users WHERE email = ?";
    await db.query(deleteUserQuery, [email]);

    // Delete the OTP from otps table
    const deleteOtpQuery = "DELETE FROM otps WHERE email = ?";
    await db.query(deleteOtpQuery, [email]);

    // Redirect to signup page with an error message
    return res.redirect("/signup?error=" + encodeURIComponent(errorMessage));
  } catch (error) {
    // Handle additional errors during the cleanup process
    handleError(res, "Error handling verification failure: " + error.message);
  }
};

// Helper function to check if OTP is valid
const isValidOtp = (otpData, enteredOtp) => {
  try {
    const storedOtp = otpData.sentotp.toString();
    const expireTime = new Date(otpData.expire_at);
    console.log("Type of enteredOtp:", typeof enteredOtp);
    console.log("Type of storedOtp:", typeof storedOtp);
    if (storedOtp === enteredOtp && new Date() < expireTime) {
      return true;
    } else {
      console.log("Invalid OTP or expired");
      return false;
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    return false;
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or username exists in the users table
    const userQuery = "SELECT * FROM users WHERE email = ? ";
    const [userResult, userFields] = await db.query(userQuery, [email]);

    if (userResult.length === 0) {
      // Redirect to login page with a generic error message if user not found
      return res.redirect("/login?error=Invalid credentials");
    }
    // check if the emailVerified status is 1 or not
    if (userResult[0].emailVerified === 0) {
      // Redirect to login page with a generic error message if email is not verified
      return res.redirect("/login?error=Email is not verified");
    }

    const storedPassword = userResult[0].password;

    // Compare the entered password with the stored hashed password
    const passwordMatch = await comparePasswords(password, storedPassword);

    // Prepare the data for jwt token
    const userData = {
      id: userResult[0].id,
      username: userResult[0].username,
      email: userResult[0].email,
    };

    if (passwordMatch) {
      // Generate JWT token
      const token = generateAuthToken(userData);

      // Store the jwt token in cookie to be used for further authentication
      res.cookie("token", token, { httpOnly: true, secure: true });
      // Redirect to the dashboard or any other authenticated page
      return res.redirect("/user/dashboard");
    } else {
      // Redirect to login page with a generic error message if password is incorrect
      return res.redirect("/login?error=Invalid credentials");
    }
  } catch (error) {
    // Handle errors and log detailed information
    handleError(res, "Error during login: " + error.message);
  }
};
exports.logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");
  // Redirect to login page
  res.redirect("/login");
};

exports.forgotPassword = async (req, res) => {
  try {
    // Receive email that requests password reset
    const email = req.body.email;

    // Check if email exists in the database
    const userQuery = "SELECT * FROM users WHERE email = ?";
    const [userRows, userFields] = await db.query(userQuery, [email]);

    if (userRows.length === 0) {
      // If email does not exist, redirect to sign up page with error message
      return res.redirect("/signup?error=Email not found. Please sign up.");
    }

    const user = userRows[0];

    if (user.emailVerified === 0) {
      // If email exists but emailverified status is 0, redirect to sign up page with error message
      return res.redirect(
        "/signup?error=Email not verified. Please verify your email."
      );
    }
    const otp = generateOTP();
    const currentTime = new Date();

    const expireTime = new Date(new Date().getTime() + 60 * 60 * 1000);
    const otpInsertData = [
      userResult.insertId,
      email,
      otp,
      currentTime,
      expireTime,
    ];

    const insertOtpQuery =
      "INSERT INTO otps (userid, email, sentotp, created_at, expire_at) VALUES (?, ?, ?, ?, ?)";

    // Execute the SQL query with the formatted Date strings
    await db.query(insertOtpQuery, otpInsertData);

    // Send verification email
    await sendVerificationEmail(email, otp);
  } catch (error) {
    // Handle errors and log detailed information
    console.error("Error during forgot password:", error);
    return res.redirect(
      "/forgot-password?error=Something went wrong. Please try again later."
    );
  }
};

exports.resetPassword = (req, res) => {
  // Logic for user reset password
};

exports.protect = (req, res) => {
  // Logic for user protect
};
