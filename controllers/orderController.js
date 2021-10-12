const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// function to create new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{

	const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice, totalPrice,} = req.body;

	const order = await Order.create({
		shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice, totalPrice,paidAt:Date.now(),
		user:req.user._id,
	});

	res.status(201).json({
		success:true,
		order,
	});

});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{



	const order = await Order.findById(req.params.id).populate("user","name email");


	if(!order){
		return next(new ErrorHandler("No order found with this ID", 404));
	}

	res.status(200).json({
		success:true,
		order,
	});
});

// get Logged in user Orders
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{



	const orders = await Order.find({user:req.user._id});


	res.status(200).json({
		success:true,
		orders,
	});
});

// get All Orders --Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{

	let totalAmount = 0;

	const orders = await Order.find();

	orders.forEach(order=>{
		totalAmount += order.totalPrice;
	});



	res.status(200).json({
		success:true,
		totalAmount,
		orders,
	});
});

//Update Order Status --Admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{

	if(!order){
		return next(new ErrorHandler("No order found with this id",404));
	}

	const order = await Order.findById(req.params.id);

	if(order.orderStatus === "Delivered"){
		return next(new ErrorHandler("You have already Delivered this order",400))
	}

// stock update acc to purchase added
	order.orderItems.forEach(async(order)=>{
		await updateStock(order.product, order.quantity);
	});

	order.orderStatus = req.body.status;
	// order.deliveredAt = Date.now(); --> checking condition for if shipped control
	if(req.body.status === "Delivered"){
		order.deliveredAt = Date.now();
	}

	await order.save({validateBeforeSave:false});
	res.status(200).json({
		success:true,

	});
});


async function updateStock (id,quantity){
	// getting product through reference
	const product = await Product.findById(id);

	product.Stock = product.Stock - quantity; //product.stock -= quantity

	await product.save({validateBeforeSave:false});
}


// delete order

// delete  Order --Admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{

	const order = await Order.findById(req.params.id);

	if(!order){
		return next(new ErrorHandler("No order found with this id",404));
	}

	await order.remove();

	res.status(200).json({
		success:true,

	});
});
