const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");




 exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{

	const {token} = req.cookies;
	// console.log(token);
	if(!token){
		return next(new ErrorHandler("Please Login to access this resource",401))
	}

	const decodedData = jwt.verify(token,process.env.JWT_SECRET);

	req.user = await User.findById(decodedData.id);
	// req.user = await User.findById(decodedData._id);

	next();

});

 // for authorized roles
 exports.authorizeRoles = (...roles) =>{
 	return (req,res,next)=>{
 		// console.log(roles)
 		if(!roles.includes(req.user.role)){
 			return next(
 			new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource `,403));
 		}
 		next();
 	};
 };