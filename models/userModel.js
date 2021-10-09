const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({

	name:{
		type:String,
		required:[true, "Please Enter Your Name"],
		maxLength:[30, "Name cannot exceed 30 chars"],
		minLength:[4, "Name should have more than chars"],
	},
	email:{
		type:String,
		required:[true,"Please Enter Your Email"],
		unique:true,
		validate:[validator.isEmail, "Please Enter a valid Email"]
	},
	password:{
		type:String,
		required:[true,"Please Enter Your Password"],
		minLength:[8,"Password should be greater than 8 chars"],
		select:false
	},
	avatar:{
		
			public_id:{
				type:String,
				required:true
			},
			url:{
				type:String,
				required:true
			}
		
	},
	role:{
		type:String,
		default:"user",
	},
	resetPasswordToken:String,
	resetPasswordExpire:Date,
});

// for bycrypting password
userSchema.pre("save", async function(next){

	// condn to check if not modified password dont update | rehash
	if(!this.isModified("password")){
		next();
	}
	// update method user details --> not for password here but follows the same process to update


	this.password = await bcrypt.hash(this.password,10);
});

	//  generating JWT Token to login automatically after register using cookie

	userSchema.methods.getJWTToken = function(){
		return jwt.sign({id:this._id},process.env.JWT_SECRET,{
			expiresIn:process.env.JWT_EXPIRE,
		});
	};

	// compare password
		userSchema.methods.comparePassword = async function(enteredPassword){
		return await bcrypt.compare(enteredPassword,this.password);
	}

	// generate password reset token

	userSchema.methods.getResetPasswordToken = function(){
		// generating token
		const resetToken = crypto.randomBytes(20).toString("hex");
		// hashing adding to users schema
		this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
		// const tokenCrypto = crypto.createHash("sha256").update(token).digest("hex")
		this.resetPasswordExpire = Date.now() + 15 * 60 *1000; //1000 converts to miliseconds
		return resetToken;

	};

module.exports = mongoose.model("User",userSchema);