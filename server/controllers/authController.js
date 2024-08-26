const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 10);
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}-${uniqueSuffix}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image ! Please only upload image files .", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.updateUserPhoto = upload.single("image");

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateUserPhotoCloudinary = catchAsync(async (req, res, next) => {
  if (req.body.image) {
    response = await cloudinary.uploader.upload(req.body.image, {
      upload_preset: "walkers",
    });
    if (response) {
      req.cloudinaryID = response;
    }
  }
  next();
});

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure:req.secure || req.headers('x-forwarded-proto')==="https"
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true
  if (req.secure) cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// const sendEmailVarification=(user,req,next) => {

//   //send email
// createSendToken(newUser, 201,req, res);
// }

exports.verifyEmail = catchAsync(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("Invalid Code", 401));
  }
  // verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("user belongs to this token no longer exists !", 401)
    );
  }
});

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.cloudinaryID);

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "mobileNumber",
    "email",
    "password",
    "passwordConfirm"
  );

  if (req.cloudinaryID) filteredBody.image = req.cloudinaryID.url;

  const newUser = await User.create(filteredBody);

  // const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });

  // createSendToken(newUser, 201,req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("No email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or Password", 401));
  }
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You must logged in to view resources", 401));
  }
  // verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("user belongs to this token no longer exists !", 401)
    );
  }

  // check user changed the password
  if (currentUser.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError("User changed password recently! Login again.", 401)
    );
  }
  // grant access to protected route
  req.user = currentUser;
  next();
});

exports.logout = (req, res) => {
  log("sigout", req.user, "User Logged out");
  res.cookie("jwt", "", {
    expires: new Date(0), // Set expiration to a past date
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
