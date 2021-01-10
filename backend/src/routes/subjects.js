const { validate, safe } = require('../libs/validate')
const { toTranslit } = require('../libs/translit')

const properties = {
	title: { type: "string" },
	description: { type: "string" }
}

const postSchema = { properties, required: [ "title" ] }

module.exports = function(app, db) {
	
	app.get('/subjects', async(req, res) => {

		const response = await db.query(`
			SELECT subjects.*, COUNT(works) AS count_works FROM subjects 
			LEFT JOIN works ON works.subject_id=subjects.id 
			GROUP BY subjects.id 
			ORDER BY subjects.creation_time
		`)

		res.json(response.rows)
	})

	app.post('/subjects', validate(postSchema), async (req, res) => {

		const { title, description } = req.body
		const url = toTranslit(title)

		const response = await db.query(
			`INSERT INTO subjects VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING id`,
			[ title, url, description, Date.now(), req.user.id ]
		)

		res.json(response.rows[0])
	})

	app.put('/subjects/:id', validate(postSchema), async (req, res) => {
		
		const { id } = req.params
		const { title, description } = req.body
		const url = toTranslit(title)

		const response = await db.query(
			`UPDATE subjects SET title=$2, url=$3, description=$4 WHERE id=$1 RETURNING *`,
			[ id, title, url, description ]
		)

		res.json(response.rows[0])
	})

	app.delete('/subjects/:id', async(req, res) => {
		const response = await db.query('DELETE FROM subjects WHERE id=$1', [ req.params.id ])
		
		res.json({count: response.rowCount})
	})
}
