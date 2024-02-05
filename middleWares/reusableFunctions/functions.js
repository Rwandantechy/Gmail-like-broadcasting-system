const db = require('../../database');

// Function to check if email already exists
const doesEmailExist = async (email) => {
    const checkEmail = 'SELECT * FROM users WHERE email = ?';
    const [rows, fields] = await db.query(checkEmail, [email]);
    return rows.length > 0;
  };
   // Function to check if username already exists
 const doesUsernameExist = async (username) => {
  const checkUsername = 'SELECT * FROM users WHERE username = ?';
  const [rows, fields] = await db.query(checkUsername, [username]);
  return rows.length > 0;
};
// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
  doesEmailExist,
  doesUsernameExist,
  generateOTP,
};