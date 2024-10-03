const { Router } = require('express');
const User = require('../models/user');
const { createHmac } = require('crypto');

const router = Router();

router.get('/signIn', (req, res) => {
      res.render("signIn");
});

router.get('/signUp', (req, res) => {
      res.render("signUp");
});

router.post('/signUp', async (req, res) => {
      console.log('Request Body:', req.body);
      const { fullName, email, password } = req.body;

      try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                  return res.render("signUp", { error: "Email already in use" });
            }
            const newUser = new User({
                  fullName,
                  email,
                  password // password will be hashed in the pre-save hook
            });
            await newUser.save();

            res.redirect("/");

      } catch (error) {
            console.error('Sign up error:', error);
            res.status(500).send("Internal server error");
      }
});

router.post('/signIn', async (req, res) => {
      const { email, password } = req.body;

      const user = await User.matchPassword(email, password);

      console.log("User: ", user);

      return res.redirect('/');

});

module.exports = router;
