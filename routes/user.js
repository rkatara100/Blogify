const { Router } = require('express');
const User = require('../models/user');

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
            const newUser = await User.create({
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

      try {
            const token = await User.matchPasswordAndGenerateToken(email, password);


            return res.cookie("token", token).redirect('/'); // Redirect after successful login
      } catch (error) {
            console.error('Sign in error:', error);
            return res.render("signIn", { error: "Invalid email or password" }); // Render signIn with an error message
      }
});


router.get('/logout', (req, res) => {
      return res.clearCookie("token").redirect('/');
})
module.exports = router;
