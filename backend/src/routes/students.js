const { validate, safe } = require('../libs/validate')
const { sendExtTokenMail } = require('../libs/mails')
const { nanoid } = require('nanoid')

const properties = {
	name: { type: "string" },
	surname: { type: "string" },
	email: { type: "string" }
}

const postSchema = { properties }

module.exports = (app, db) => {

	app.get('/groups/:url', async(req, res) => {

		const response = await db.query(`
			SELECT users.id, name, surname, avatar, email FROM students_groups 
			LEFT JOIN groups ON groups.id = group_id
			LEFT JOIN users ON users.id = student_id
			LEFT JOIN accounts ON users.id = accounts.user_id
			WHERE url=$1
			ORDER BY surname, name
		`, [ req.params.url ])		

		res.json(response.rows)
	})


	app.post('/groups/:url', validate(postSchema), async(req, res) => {
		
		const { email, name, surname } = req.body

		const response = await db.query('SELECT id, captain_id FROM groups WHERE url = $1', [ req.params.url ])
		if(response.rowCount === 0) return res.json({error: "wrong url"})		

		const { captain_id, id: group_id } = response.rows[0]

		if(captain_id !== req.user.id) return res.json({error: "wrong rights"}) 

		if(email){
			const existsResponse = await db.query('SELECT user_id FROM accounts WHERE email=$1', [ email.toLowerCase() ])

			if(existsResponse.rowCount > 0){
				
				await addUserToGroup(db, existsResponse.rows[0].user_id, group_id)

			}else{
				if(!name || !surname) return res.json({email: "Пользователя не существует"})

				const token = nanoid(40)

				await sendExtTokenMail({ name, email }, token)

				const { id } = await addUser(db, { name, surname, email }, token)
				await addUserToGroup(db, id, group_id)
			}

		}else{
			const { id } = await addUser(db, { name, surname })
			await addUserToGroup(db, id, group_id)

			
		}

		res.json({count: 1})
	})
}


async function addUser(db, info, token = null){

	const response = await db.query(
		`INSERT INTO users VALUES (DEFAULT, $1, $2, NULL, NULL, $3) RETURNING id`,
		[ info.name, info.surname, Date.now() ]
	)
	
	const id = response.rows[0].id

	if(token){
		const response3 = await db.query(
			`INSERT INTO reg_requests VALUES ($1, $2, $3)`,
			[ token, {...info, id, role: 'student'}, Date.now() ]
		)
	}

	return { id }

}

async function addUserToGroup (db, student_id, group_id){
	const response = await db.query(
		'INSERT INTO students_groups VALUES ($1, $2)', 
		[ student_id, group_id ]
	)

	return { count: response.rowCount }
}