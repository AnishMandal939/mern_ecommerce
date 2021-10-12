const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");




// registration user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

	const {name,email,password} = req.body;

	const user = await User.create({
		name,email,password,avatar:{
			public_id:"temp avatar id",
			url:"profilepicurl"
		},
	});

	// calling token jwt
	// const token = user.getJWTToken();

	// res.status(201).json({
	// 	success:true,
	// 	user,
	// 	token,
	// })
	sendToken(user,201,res);

});


// login user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

	const {email,password} = req.body;

	// checking if user has given password and email both

	if(!email || !password){
		return next(new ErrorHandler("Please Enter Email and Password",400));
	}

	const user = await User.findOne({email}).select("+password");

	if(!user){
		return next(new ErrorHandler("Invalid email or password",401));
	}

	const isPasswordMatched = await user.comparePassword(password);


	if(!isPasswordMatched){
		return next(new ErrorHandler("Invalid email or password",401));
	}

		// calling token jwt
	// 	const token = user.getJWTToken();

	// 	res.status(200).json({
	// 	success:true,
	// 	token,
	// });
	// instead of above commented method now calling from sendjson token file 
	sendToken(user,200,res);
});


// logout
exports.logout = catchAsyncErrors(async(req,res,next)=>{

	res.cookie("token",null,{
		expires: new Date(Date.now()),
		httpOnly:true,
	});

	res.status(200).json({
		success:true,
		message:"Logout Success"
	});
});


// for forgot password function 

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

	// find user
	const user = await User.findOne({email: req.body.email});
	
	// if !found user

	if(!user){
		return next(new ErrorHandler("User not found",404));
	}

	// get reset password token
	const resetToken = user.getResetPasswordToken();

	// saving user because added not saved
	await user.save({validateBeforeSave:false});

	// making link to reset password
	// const getResetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
	const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

	// creating message for email send to user

	const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

	// send message
	try{
		await sendEmail({
			email:user.email,
			subject:`Ecommerce password recovery token`,
			message,

		});
		res.status(200).json({
			success:true,
			message:`Email sent to ${user.email} successfully`
		})

	}catch(error){
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({validateBeforeSave:false});

		return next(new ErrorHandler(error.message,500))
	}

});


// resetpassword token  after sent 
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
	// creating token hash
	const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

	// find user using hash token
	const user = await User.findOne({
		resetPasswordToken:resetPasswordToken,
		resetPasswordExpire:{$gt:Date.now() },
	});

	if(!user){
		return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
	}

	if(req.body.password !== req.body.confirmPassword){
		return next(new ErrorHandler("Password does not matched",400));

	}

	// if okey change p[assword
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;


		await user.save();

		// since changed password letting user to login in
		sendToken(user,200,res);

});


// get user details -> this route is only accessible only when user is logged in 

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

	const user = await User.findById(req.user.id);

	// only accesible whn logged in
	res.status(200).json({
		success:true,
		user,
	});


});

// update/change password route user
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

	const user = await User.findById(req.user.id).select("+password");

const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

if(!isPasswordMatched){
	return next(new ErrorHandler(" Old password is incorrect", 400));
}

	if(req.body.newPassword !== req.body.confirmPassword){
		return next(new ErrorHandler(" password not matched",400))
	}

	// if inputed correct
	user.password = req.body.newPassword;
	await user.save();

	sendToken(user,200,res);

	// only accesible whn logged in
	// res.status(200).json({
	// 	success:true,
	// 	user,
	// });


});

// update profile mehod

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

	const newUserData = {
    	name: req.body.name,
    	email: req.body.email,
  	};


		// we will add avatar later after using cloudiary

		const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		    new: true,
		    runValidators: true,
		    useFindAndModify: false,
		  });

		  res.status(200).json({
		    success: true,
		  });
		});


// get all users (admin)

exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{

	const users = await User.find();

	res.status(200).json({
		success:true,
		users,
	})
});

// get all/single users details -> for admin

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
	}

	res.status(200).json({
		success:true,
		user,
	})
})


// 
// update user role by admin

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

	const newUserData = {
    	name: req.body.name,
    	email: req.body.email,
    	role:req.body.role,
  	};

		const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		    new: true,
		    runValidators: true,
		    useFindAndModify: false,
		  });

		  res.status(200).json({
		    success: true,
		  });
		});


// delete user  by admin

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
	const user = await User.findById(req.params.id);

	if(!user){
		return next(ErrorHandler(`User doesnot exist with id: ${req.params.id}`,400));
	}

	// we will remove cloudinary later
			await user.remove();

		  res.status(200).json({
		    success: true,
		    message:"User Deleted Successfully",
		  });
		});