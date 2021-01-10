const { validate, safe } = require('../../libs/validate')
const AuthUser = require('./auth-user')

const properties = {
	email: { type: "string" },
	password: { type: "string" }
}

const postSchema = { properties, required: ["email", "password"] }


module.exports = function(app, db) {

	//Аутентификация
	app.post('/login', validate(postSchema), async(req, res) => {
		
		const { email, password } = req.body
		const data = await AuthUser(email, password, db)
		if(data.error) return res.json(data)

		if(data.token) res.setHeader("Set-Cookie", `token=${data.token};max-age=31536000; path=/`)

		res.json({success: "success"})
	})

	//Разлогинирование
	app.delete('/login', async(req, res) => {
		res.setHeader("Set-Cookie", `token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)

		res.json({success: "success"})
	})

}