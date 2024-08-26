const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    // minlength: [15, "Should contain atleast 10 charachters"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    // minlength: [15, "Should contain atleast 10 charachters"],
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile Number is required"],
    // minlength: [15, "Should contain atleast 10 charachters"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
    // minlength: [15, "Should contain atleast 10 charachters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  // photo: {type:String ,default:'default.jpg'},
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Re-enter your password"],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Password not matched",
    },
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
