const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const AppError = require("../utils/appError")
// const handleFactory = require('./handleFactory'); 
const multer  = require('multer');



const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10)
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}-${uniqueSuffix}.${ext}`);
  }
});

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }else{
    cb(new AppError("Not an image ! Please only upload image files .",400),false)
  }

}


const upload = multer({
  storage : multerStorage,
  fileFilter:multerFilter
});


exports.updateUserPhoto = upload.single('image');

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}




exports.updateMe = catchAsync(async (req, res, next) => {


  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not defined for upadate passwords. please use /updatePassword",
        400
      )
    )
  }
  //update user
  //   const user = await User.findById(req.user.id)
  //   user.name = req.body.name
  //   await user.validate()
  //   await user.save()

  const filteredBody = filterObj(req.body, "name", "email")
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  })
  res.status(204).json({
    status: "success",
    data: null,
  })
});

exports.getMe=(req,res,next)=>{
  req.params.id =req.user.id;
  next();
}

// exports.getAllUsers = handleFactory.getAll(User);
// exports.getUser = handleFactory.getOne(User);
// exports.createUser = handleFactory.createOne(User);
// // do not update passwords with this
// exports.updateUser = handleFactory.updateOne(User);
// exports.deleteUser = handleFactory.deleteOne(User);


