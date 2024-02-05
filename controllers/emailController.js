// emailController.js
exports.sendEmail = (req, res) => {
// "niyinnocent2027@gmail.com",
// "innocent.niyonzima111213@marwadiuniversity.ac.in",
// "kanishka.kashyap117567@marwadiuniversity.ac.in",
// "sarjil.juneja17873@marwadieducation.edu.in",
// "khushal.katdare17093@marwadieducation.edu.in",
  const allmails = [ ];
   allmails.push(req.body.email);

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:dotenv.SENDING_MAIL,
      pass:dotenv.SENDING_PASS,
    },
  });
  for (var i = 0; i < allmails.length; i++) {
    console.log(allmails[i]);
    var mailOptions = {
      from: dotenv.SENDING_MAIL,
      to: allmails[i],
      subject: req.body.subject,
      html: "Now, we can only improve this by making a beautiful template and send it to many users at once!",
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Email sent: " + info.response);
        res.send("Email sent successfully!");
      }
    });
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


