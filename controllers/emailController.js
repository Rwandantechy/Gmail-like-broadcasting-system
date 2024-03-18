// emailController.js
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
// "niyinnocent2027@gmail.com",
// "innocent.niyonzima111213@marwadiuniversity.ac.in",
// "kanishka.kashyap117567@marwadiuniversity.ac.in",
// "sarjil.juneja17873@marwadieducation.edu.in",
// "khushal.katdare17093@marwadieducation.edu.in",
// const allmails = [ ];
//  allmails.push(req.body.email);
exports.sendEmail = (req, res) => {
  if (req.body.Allemails && typeof req.body.Allemails === "string") {
    const allEmails = req.body.Allemails;

    // Split the string into an array of email addresses
    const emailArray = allEmails.split(", ");

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDING_MAIL,
        pass: process.env.SENDING_MAIL_PASSWORD, 
      },
    });

    // Iterate through the array and send emails
    emailArray.forEach((email) => {
      const mailOptions = {
        from: process.env.SENDING_MAIL,
        to: email,
        subject: req.body.emailSubject,
        html: req.body.emailBody,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });

    // Send a single response after all emails are sent
    res.send("Emails sent successfully!");
  } else {
    res
      .status(400)
      .send("Invalid request. 'Allemails' field not found or not a string.");
  }
};

exports.getReply = (req, res) => {
  // Logic for fetching replies
};
exports.sendReply = (req, res) => {
  // Logic for sending replies
};
exports.deleteReply = (req, res) => {
  // Logic for deleting replies
};
exports.fetchEmails = (req, res) => {
  // Logic for fetching emails
};
exports.deleteEmail = (req, res) => {
  // Logic for deleting emails
};
exports.fetchEmail = (req, res) => {
  // Logic for fetching email
};
exports.updateEmail = (req, res) => {
  // Logic for updating email
};
exports.createEmail = (req, res) => {
  // Logic for creating email
};
