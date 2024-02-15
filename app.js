/* eslint-disable no-undef */
const express = require("express");
const app = express();
const checkAuth = require("./middleWares/reusableFunctions/jwtAuth.js");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./database");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const emailRoutes = require("./routes/emailRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { error } = require("console");
db.connectDatabase();
app.use(morgan("dev"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/user", dashboardRoutes);
app.use("/email", emailRoutes);
app.use("/admin", adminRoutes);
app.get("/", (req, res) => {
  res.render("index");
});
// route for signup
app.get("/signup", (req, res) => {
  // check if there is an error in the query string
  if (req.query.error) {
    res.locals.error = req.query.error;
  }
  res.render("signup", { error: req.query.error });
});
// route for login
app.get("/login", (req, res) => {
  // check if there is an error in the query string
  if (req.query.error) {
    res.locals.error = req.query.error;
  }
  res.render("login", { error: req.query.error });
});
// route for forgot password page
app.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});
// route for reset password page
app.get("/reset-password", (req, res) => {
  res.render("resetPassword");
});
//route for otp verification page
app.get("/signup-success", (req, res) => {
  res.render("signup-success");
});
// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});



module.exports = app;
