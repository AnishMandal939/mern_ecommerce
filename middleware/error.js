// ?ErrorHandler = className & errorHandler = filename
const ErrorHandler = require("../utils/errorHandler");


module.exports = (err,req, res,next) =>{
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// cast error | Wrong mongodb ID error
	if(err.name === "CastError"){
		const message  = `Resource not found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}


	// mongoose duplicate key error sam email registration 

	if (err.code && err.code === 11000){
		// const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
		const message = `Duplicate || Data Already Exist`;
		err = new ErrorHandler(message, 400);
	}
	// mongoose duplicate key error sam email registration end

	// for jwt error
	if(err.name === "JsonwebtokenError"){
		const message = `Json webToken is Invalid , try again`;
		err  = new ErrorHandler(message,400);
	}
	// for jwt error

		// for jwt expire error
	if(err.name === "TokenExpiredError"){
		const message = `Json webToken is Expired , try again`;
		err  = new ErrorHandler(message,400);
	}
	// for jwt expire error

	res.status(err.statusCode).json({
		success:false,
		message: err.message,
		// error:err,
		// error:err.stack, -->gives you location where you are getting error
	});
};