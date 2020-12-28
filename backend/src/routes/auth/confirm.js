const { validate, safe } = require('../../libs/validate')

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

		const response = await registerUser(token, password, db)
		res.json(response)
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

	const response2 = await db.query(
		`INSERT INTO users (name, surname, email, password, role, creation_time) 
		VALUES ($1, $2, $3, digest($4, 'sha1'), $5, $6)`,
		[ name, surname, email, password, role, Date.now() ]
	)

	return { count: response2.rowCount }
}