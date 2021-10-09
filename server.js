const app = require('./app');

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

// Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server due to Uncaught Exception`);

	process.exit(1);
})

// config

dotenv.config({path:"server/config/config.env"});

// connecting database


connectDatabase()


// creating server
const server = app.listen(process.env.PORT,()=>{
	console.log(`Server running on port http://localhost:${process.env.PORT}`)
} );

// another err for uncaught error resolving this also 
// console.log(youtube); --> this will give you uncaught error youtube not defined

// unhandled promise rejection
process.on("unhandledRejection",err=>{
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server due to Unhandled Promise Rejection`);

	// closing server
	server.close(()=>{
		process.exit(1);
	});
});

// now after resolving this unhandled promise rejection you dont need to use catch block comment it out or remove it in database.js

// last type error is mongodberror -> cast error