/* eslint-disable no-undef */
const express = require("express");
const app = express();
const checkAuth= require("./middleWares/reusableFunctions/jwtAuth.js");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const path = require("path");
const db = require("./database");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const emailRoutes = require("./routes/emailRoutes");
const adminRoutes = require("./routes/adminRoutes");
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
  res.render("signup");
});
// route for login
app.get("/login", (req, res) => {
  res.render("login");
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
module.exports = app;
