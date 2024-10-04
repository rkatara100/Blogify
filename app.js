const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const { checkforAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogify', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MongoDB connected successfully"))
      .catch(err => console.error("MongoDB connection error:", err));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
      res.render("home", { user: req.user });
});

app.use('/user', userRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
      if (err.name === 'ValidationError') {
            return res.status(400).send(err.message); // Bad request for validation errors
      }
      console.error(err.stack);
      res.status(500).send("Something broke!"); // Generic server error
});

// Start the server
app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});
