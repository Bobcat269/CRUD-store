const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');


router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
  });
  
  router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
  });
  
  router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  
  router.post('/sign-up', async (req, res) => {
    try {
      // Check if the username exists, if pass, continue
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (userInDatabase) {
        return res.send('Username already taken.');
      }
   
      //Password and confirm password match?
      if (req.body.password !== req.body.confirmPassword) {
        return res.send('Oops password and confirm password do not match.');
      }
    
      //Encrypt Password
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
    
      // Create User
      await User.create(req.body);
    
      res.redirect('/auth/sign-in');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
  router.post('/sign-in', async (req, res) => {
    try {
      //Find user in Users
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (!userInDatabase) {
        return res.send('Login failed. Please try again.');
      }
    
      //Check password
      const validator = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      if (!validator) {
        return res.send('Login failed. Please try again.');
      }
    
      //Initialize user session
      req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
      };
    
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
  module.exports = router;
  