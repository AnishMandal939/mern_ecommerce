class ErrorHandler extends Error{
	// create constructor
	constructor(message,statusCode){
		super(message);
		this.statusCode = statusCode

		// calling method
		Error.captureStackTrace(this,this.constructor);
	}
}

module.exports = ErrorHandler