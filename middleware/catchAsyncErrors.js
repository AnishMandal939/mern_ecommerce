module.exports = theFunc => (req,res,next) =>{
	Promise.resolve(theFunc(req,res,next)).catch(next);
};

// async comes with await it needs to be handled because if while inputing any item in to product and you miss name or any thing that is required will throw you error , so is a best practice