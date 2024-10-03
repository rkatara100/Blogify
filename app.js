const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogify')
      .then(() => {
            console.log("MongoDB connected successfully");
      })
      .catch((err) => {
            console.error("MongoDB connection error:", err);
      });

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
      res.render("home");
});

app.use('/user', userRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});
