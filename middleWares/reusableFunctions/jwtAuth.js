const jwt = require("jsonwebtoken");
const process = require("process");

// Helper function to generate JWT tokens with user data
const generateAuthToken = (input) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ input }, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
};

// Helper function to verify JWT tokens
const verifyAuthToken = (token) => {
  const secretKey = process.env.JWT_SECRET;
  try {
    // if token has Bearer at the start, remove it
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    } else {
      token = token.trim();
    }

    if (token === null) {
      throw new Error("Token splitting failed");
    }
    // Verify the token
    const decoded = jwt.verify(token, secretKey, { algorithm: "HS256" });

    // Check if the token has expired
    if (decoded && decoded.exp) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        throw new Error("Token has expired");
      }
    }

    return decoded;
  } catch (error) {
    // If token verification fails, return null
    return null;
  }
};

// Middleware to check if user is logged in
const checkAuth = (req, res, next) => {
  try {
    // Get the token from the request cookies or headers
    const token = req.cookies.token || req.headers.authorization;
    // Verify the token
    const decoded = verifyAuthToken(token);

    if (!decoded) {
      throw new Error("Token verification failed");
    }
    // return the decoded token

    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};

// exports the functions
module.exports = {
  generateAuthToken,
  verifyAuthToken,
  checkAuth,
};
