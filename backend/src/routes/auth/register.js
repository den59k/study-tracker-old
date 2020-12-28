const { validate, safe } = require('../../libs/validate')
const { nanoid } = require('nanoid')
const { sendTokenMail } = require('../../libs/mails')

const properties = {
	email: { type: "string" },
	name: { type: "string" },
	surname: { type: "string" },
	role: { type: "integer" }
}

const postSchema = { properties, required: [ "email", "name", "surname", "role" ] }

module.exports = function(app, db) {
	
	app.post('/register', validate(postSchema), safe(async(req, res) => {
		const { email, name, surname, role } = req.body

		const response = await createRegRequest({ email, name, surname, role }, db)
		res.json(response)
	}))
}

async function createRegRequest (info, db){
	const token = nanoid(40)

	await sendTokenMail(info, token)
	const response = await db.query('INSERT INTO reg_requests VALUES ($1, $2, $3)', [ token, info, Date.now() ])
	return {count: response.rowCount}
}

