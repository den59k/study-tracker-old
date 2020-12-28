const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_LOGIN, 
		pass: process.env.SMTP_PASSWORD, 
	},
});

async function sendMail(email, theme, html){
	const sendResponse = await transporter.sendMail({
		from: `"StudyTracker "<${process.env.SMTP_LOGIN}>`,
		to: email,
		subject: theme,
		html: html
	});

	return sendResponse
}

async function sendTokenMail (info, token){
	const link = process.env.ADDRESS+'/confirm/'+token
	const html = `
<h1>StudyTracker - система учета успеваемости</h1>
<h3>Добрый день, ${info.name}!</h3><br/>
Вы подавали заявку на регистрацию в системе StudyTracker.<br/><br/>
Для завершения регистрации вам необходмо перейти по ссылке:<br/>
<a href=${link}>${link}</a>
	`
	
	const sendResponse = await sendMail(info.email, 'Регистрация в системе StudyTracker', html)

	console.log(sendResponse)
}

module.exports = { sendTokenMail }