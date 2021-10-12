const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


// create product --> Admin Route
exports.createProduct = catchAsyncErrors(async (req, res,next)=>{
	// getting name who created product if found multiple admin roles
	req.body.user = req.user.id;
	const product = await Product.create(req.body);

	res.status(201).json({
		success:true,
		product
	})
});



// get all products
// dummy test
// exports.getAllProducts = (req, res) => {
// 	res.status(200).json({message: "Product controllers "})
// }
// using promise
exports.getAllProducts = catchAsyncErrors(async(req, res) => {

	// for pagination
	const resultPerPage = 5;
	// for count 
	const productCount = await Product.countDocuments();

	// const ApiFeature = new ApiFeatures(Product.find(),req.query.keyword);
	const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
	// const apiFeature = new ApiFeatures(Product.find(),req.query).filter();
	// const apiFeature = new ApiFeatures(Product.find(),req.query).pagination(resultPerPage);

	const products = await apiFeature.query;
	// const products = await Product.find();
	res.status(200).json({
		success:true,
		products,
		productCount
	})
});

// get single product details function controllers
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
	const product = await Product.findById(req.params.id);

	if(!product){
		// return res.status(500).json({
		// 	success:false,
		// 	message: "Product not found"
		// })
		// Instead of this now we use middleware error handler
		return next(new ErrorHandler("Product not found", 404))
	}

	await product.remove();

	res.status(200).json({
		success:true,
		product
	})
});

// creating update controller function --> admin route
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
	let product = await Product.findById(req.params.id);

	// !found product
	if(!product){
		return next(new ErrorHandler("Product not found", 404))

	}

	product = await Product.findByIdAndUpdate(req.params.id, req.body,{
		new:true, runValidators:true, useFindAndModify:false
	});
	res.status(200).json({
		success:true,
		product
	})
});


// delete product function controllers
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
	const product = await Product.findById(req.params.id);

	if(!product){
		return next(new ErrorHandler("Product not found", 404))
	}

	await product.remove();

	res.status(200).json({
		success:true,
		message:"Product Deleted Successfully"
	})
});



// create new review or update the review
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{

	// destructuring
	const {rating,comment,productId} = req.body

	const review ={
		user:req.user._id,
		name:req.user.name,
		rating:Number(rating),
		comment,

	};
	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

	if(isReviewed){
		product.reviews.forEach((rev) =>{
			if(rev.user.toString()=== req.user._id.toString())
				rev.rating = rating,
				rev.comment = comment;
		});

	}else{
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}
	// overall rating -> lets say we have rating 4,5,2,5,4 = total 20 to get average  divide by product review range
	let avg=0;

	product.reviews.forEach((rev)=>{
		avg += rev.rating; //avg = avg+rev.rating
	})


	product.ratings = avg / product.reviews.length;

	await product.save({validateBeforeSave:false});

	res.status(200).json({
		success:true,

	});
});


// get all reviews of a single product

exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{

	const product = await Product.findById(req.query.id);

	if(!product){
		return next(new ErrorHandler("Product Not Found",400));
	}

	res.status(200).json({
		success:true,
		reviews:product.reviews,
	});
});

// delete reviews

exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
	const product = await Product.findById(req.query.productId); //productid

	if(!product){
		return next(new ErrorHandler("Product not found",404));
	}

	// getting all products which we want to review but not to delete
	const reviews = product.reviews.filter((rev)=>rev._id.toString() !== req.query.id.toString()); //review id

// reviews
	let avg = 0;

	reviews.forEach((rev)=>{
		avg += rev.rating;
	});

	const ratings = avg / reviews.length;

	// let ratings = 0;

	// if(reviews.length === 0){
	// 	ratings = 0;
	// }else{
	// 	ratings = avg / reviews.length;
	// }

	const numOfReviews = reviews.length;

	await Product.findByIdAndUpdate(req.query.productId,{
		reviews,ratings,numOfReviews,
	},
	{
	new:true,
	runValidators:true,
	useFindAndModify:false,
	},
  );

	res.status(200).json({
		success:true,
	});
});