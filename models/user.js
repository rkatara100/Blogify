const { Schema, model } = require('mongoose');
const { randomBytes, createHmac } = require('crypto');

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
      salt: {
            type: String,
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
UserSchema.pre("save", function (next) {
      const user = this;

      // Only hash the password if it has been modified (or is new)
      if (!this.isModified('password')) return next();

      // Generate a new salt and hash the password
      const salt = randomBytes(16).toString('hex'); // Use hex encoding
      const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

      // Assign the salt and hashed password to the user
      this.salt = salt;
      this.password = hashedPassword;

      next();
});

UserSchema.static("matchPassword", async function (email, password) {

      const user = await UserSchema.findOne({ email });

      if (!user) {
            throw new Error("something went wrong with Email or Password!");
      }

      const salt = user.salt;
      const hashedPassword = user.password;

      const userProvidehash = createHmac("sha256", salt).update(password).digest("hex");
      if (hashedPassword !== userProvidehash) {
            throw new Error("something went wrong with Email or Password!");

      }

      return { ...user, password: undefined, salt: undefined };

})




const User = model("User", UserSchema);

module.exports = User;
