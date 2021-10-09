// creating fxn
// import nodemailer
const nodeMailer = require("nodemailer");

const sendEmail = async(options)=>{
	const transporter = nodeMailer.createTransport({
		// use only if gmail service doesnt work inside block one out of comment is okey 
		host:process.env.SMTP_HOST,
		port:process.env.SMTP_PORT,
		// use only if gmail service doesnt work 
		service:process.env.SMTP_SERVICE,
		auth:{
			user:process.env.SMTP_MAIL,
			pass:process.env.SMTP_PASSWORD,
		},
	});

	// mail option
	const mailOptions = {
		from:process.env.SMTP_MAIL,
		to:options.email,
		subject:options.subject,
		text:options.message,
	};
	// object and transporter are made now make send email
	await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;