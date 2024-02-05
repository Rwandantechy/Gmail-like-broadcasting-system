const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 14;
// Helper function to hash passwords
const hashInputData = async (string) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedString = await bcrypt.hash(string, salt);

    return hashedString;
  } catch (error) {
    // Handle error
    console.error("Error hashing input data:", error.message);
    throw new Error("Error hashing input data");
  }
};

// Helper function to compare passwords
const comparePasswords = async (password, hashedPassword) => {
  try {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
  } catch (error) {
    // Handle error
    console.error("Error comparing passwords:", error.message);
    throw new Error("Error comparing passwords");
  }
};

module.exports = {
  hashInputData,
  comparePasswords,
};
