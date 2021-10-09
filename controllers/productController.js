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