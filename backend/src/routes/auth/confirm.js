const { validate, safe } = require('../../libs/validate')
const AuthUser = require('./auth-user')

const properties = {
	password: { type: "string" },
}

const postSchema = { properties, required: [ "password" ] }

module.exports = function(app, db) {
	
	app.get('/confirm/:token', safe(async(req, res) => {
		const token = req.params.token

		const response = await getUserInfo(token, db)
		res.json(response)
	}))

	app.post('/confirm/:token', validate(postSchema), safe(async(req, res) => {
		const token = req.params.token
		const { password } = req.body

		const data = await registerUser(token, password, db)
		if(data.error) return res.json(data)
		if(data.token) res.setHeader("Set-Cookie", `token=${data.token};max-age=31536000; path=/`)

		res.json({count: 1})
	}))

}

async function getUserInfo (token, db){
	const response = await db.query('SELECT info FROM reg_requests WHERE token=$1', [ token ])

	if(response.rowCount === 0)  return { error: "wrong token" }
		
	return response.rows[0].info
}

async function registerUser (token, password, db){

	const response = await db.query('SELECT info FROM reg_requests WHERE token=$1', [ token ])
	if(response.rowCount === 0) return { error: "wrong token" }

	const { name, surname, email, role } = response.rows[0].info
	let id = response.rows[0].info.id

	const client = await db.connect()

	try{

		await client.query('BEGIN')

		//Если у нас еще нет аккаунта - создаем его
		if(!id){
			const response2 = await client.query(
				`INSERT INTO users VALUES (DEFAULT, $1, $2, NULL, NULL, $3) RETURNING id`,
				[ name, surname, Date.now() ]
			)

			id = response2.rows[0].id
		}

		const response3 = await client.query(
			`INSERT INTO accounts VALUES ($1, $2, $3, digest($4, 'sha1'))`,
			[ id, email, role, password ]
		)
		
		const authData = await AuthUser(email, password, client)
		
		await client.query('COMMIT')

		return authData

	}catch(e){

		console.log(e)

		await client.query('ROLLBACK')

		return { error: "exists" }
	}
	
}