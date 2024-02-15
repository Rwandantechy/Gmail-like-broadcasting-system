const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { checkAuth } = require('../middleWares/reusableFunctions/jwtAuth');

router.get('/dashboard', checkAuth, async (req, res) => {
    try {
      // Access the username
      const username = req.userData.input.username;      
  
      // Render the dashboard with the username
      res.render('dashboard', { username });
    } catch (error) {
      // If an error occurs, redirect the user to the login page
      res.redirect('/login');
    }
  });

  router.get('/drafts',checkAuth,  async (req, res) => {
    try {
      // Access the username
      const username = req.userData.input.username;      
  
      // Render the dashboard with the username
      res.render('drafts', { username });
    } catch (error) {
      // If an error occurs, redirect the user to the login page
      res.redirect('/login');
    }
  });
  router.get('/subscribers',checkAuth,  async (req, res) => {
    try {
      // Access the username
      const username = req.userData.input.username;      
  
      // Render the dashboard with the username
      res.render('allSubscribers', { username });
    } catch (error) {
      // If an error occurs, redirect the user to the login page
      res.redirect('/login');
    }
  });
  router.get('/scheduled',checkAuth,  async (req, res) => {
    try {
      // Access the username
      const username = req.userData.input.username;      
  
      // Render the dashboard with the username
      res.render('scheduled', { username });
    } catch (error) {
      // If an error occurs, redirect the user to the login page
      res.redirect('/login');
    }
  });
module.exports = router;