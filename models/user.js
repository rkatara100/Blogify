const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { createTokenforUser } = require('../utils/authentication')

// User Schema definition
const UserSchema = new Schema({
      fullName: {
            type: String,
            required: true
      },
      email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Ensures email is stored in lowercase
            trim: true // Removes whitespace from the beginning and end
      },
      password: {
            type: String,
            required: true,
      },
      profileImageURL: {
            type: String,
            default: './public/images/default.png'
      },
      role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
      }
}, { timestamps: true });

// Pre-save hook for hashing the password
UserSchema.pre("save", async function (next) {
      const user = this;

      // Only hash the password if it has been modified (or is new)
      if (!this.isModified('password')) return next();

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(user.password, salt);

      next();
});

// Static method for matching password and generating token
UserSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
      const user = await this.findOne({ email });

      if (!user) {
            throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
            throw new Error("Invalid email or password");
      }

      const token = createTokenforUser(user); // Ensure this function is defined elsewhere
      return token;
});

const User = model("User", UserSchema);

module.exports = User;
