const { validate, safe } = require('../../libs/validate')
const { nanoid } = require('nanoid')

const properties = {
	email: { type: "string" },
	password: { type: "string" }
}

const postSchema = { properties, required: ["email", "password"] }


module.exports = function(app, db) {

	app.post('/login', validate(postSchema), async(req, res) => {
		
		const { email, password } = req.body
		const data = await AuthUser(email, password, db)
		if(data.error) return res.json(data)

		if(data.token) res.setHeader("Set-Cookie", `token=${data.token};max-age=31536000; path=/`)

		res.json({success: "success"})
	})

}

async function AuthUser(email, password, db){
	const response = await db.query(
		`SELECT password = digest($2, 'sha1') true_password, id, token FROM users WHERE email=$1`, 
		[ email, password ]
	)

	if(response.rowCount === 0) return { error: { email: "Нет такого email" } }
	const { id, true_password, token } = response.rows[0]

	if(true_password === false) return { error: { password: "Неверный пароль" } } 
	
	if(token !== null) return { token }

	//Если токена нет - создаем его
	const newToken = nanoid(30)
	const response2 = await db.query(
		'UPDATE users SET token=$2, last_login_time=$3 WHERE id=$1', 
		[ id, newToken, Date.now() ]
	)

	return { token: newToken }
}