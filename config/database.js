const mongoose = require("mongoose");


const connectDatabase = () =>{
	// mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true}).then((data)=>{
	mongoose.connect(process.env.DB_URI,{}).then((data)=>{

	console.log(`Connected mongodb test: ${data.connection.host}`);	
	
})
	// this catch block is being handled by unhandled promise rejection block in server.js
// 	.catch((err)=>{
// 	console.log(err)
// })
}

module.exports = connectDatabase