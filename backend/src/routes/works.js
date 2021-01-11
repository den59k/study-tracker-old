const { validate, safe } = require('../libs/validate')
const { toTranslit } = require('../libs/translit')

const properties = {
	type: { type: "string" },
	title: { type: "string" },
	theme: { type: "string" },
	description: { type: "string" },
}

const postSchema = { properties, required: [ "type", "title" ] }

module.exports = function(app, db) {
	
	app.get('/subjects/:subject_url', async(req, res) => {

		const { subject_url } = req.params
		const response = await db.query(
			`SELECT works.* FROM works LEFT JOIN subjects ON works.subject_id = subjects.id WHERE subjects.url = $1 ORDER BY works.creation_time`,
			[ subject_url ]
		)

		res.json(response.rows)
	})

	app.post('/subjects/:subject_url', validate(postSchema), async (req, res) => {

		const { subject_url } = req.params
		const { type, title, theme, description } = req.body
		const url = toTranslit(title)

		try{
			const response = await db.query(
				`INSERT INTO works (subject_id, type, url, title, theme, description, creation_time) 
				SELECT id, $2, $3, $4, $5, $6, $7 FROM subjects WHERE url=$1 
				RETURNING id, url`,
				[ subject_url, type, url, title, theme, description, Date.now() ]
			)

			res.json(response.rows[0])
		}catch(e){
			res.json({error: "exists"})
		}
	})

	app.put('/subjects/:subject_url/:url', validate(postSchema), async (req, res) => {
		
		const { subject_url, url } = req.params
		const { type, title, theme, description } = req.body
		const newUrl = toTranslit(title)

		const response = await db.query(
			`UPDATE works SET type=$3, title=$4, url=$5, theme=$6, description=$7 WHERE url=$1 AND subject_id=(SELECT id FROM subjects WHERE url=$2) RETURNING url`,
			[ url, subject_url, type, title, newUrl, theme, description ]
		)
		
		if(response.rowCount === 0)	res.json({error: "db error"})
		
		res.json(response.rows[0])
		
	})

	app.delete('/subjects/:subject_url/:url', async(req, res) => {
		const { subject_url, url } = req.params

		const response = await db.query('DELETE FROM works WHERE url=$1 AND subject_id=(SELECT id FROM subjects WHERE url=$2)', [ url, subject_url ])
		
		res.json({count: response.rowCount})
	})
}
