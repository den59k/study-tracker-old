const { validate, safe } = require('../libs/validate')
const { getUrl } = require('../libs/translit')

const properties = {
	title: { type: "string" },
	subjects: { type: "array" }
}

const postSchema = { properties, required: [ "title" ] }

module.exports = function(app, db) {

	app.get('/groups', async(req, res) => {
		
		if(req.user.role === 'teacher'){
			const response = await getTeacherGroups(db, req.user.id)
			res.json(response)
		}

		if(req.user.role === 'student'){
			const response = await getUserGroups(db, req.user.id)
			res.json(response)
		}

	})


	app.post('/groups/own', validate(postSchema), async(req, res) => {
		const { title, subjects } = req.body
		const response = await createGroup(db, title, subjects, req.user.id)
		res.json(response)
	})

	app.put('/groups/:url', validate(postSchema), async(req, res) => {
		const { title, subjects } = req.body
		const { url } = req.params
		const response = await editGroup(db, url, title, subjects, req.user.id)
		res.json(response)
	})

	app.delete('/groups/:url', async(req, res) => {
		const { url } = req.params
		const groupResponse = await db.query('SELECT id, captain_id FROM groups WHERE url=$1', [ url ])
		
		if(groupResponse.rowCount === 0) return res.json({error: "wrong url"})
		
		const { id, captain_id } = groupResponse.rows[0]

		if(captain_id === req.user.id){
			const response = await deleteGroup(db, id)
			return res.json(response)
		}

		res.json({some: "thing"})
	})

}

async function getTeacherGroups(db, teacher_id){

	const responseOwn = await db.query(`
		SELECT groups.*, array_remove(array_agg(subject_id), NULL) AS subjects FROM groups 
		LEFT JOIN (
			SELECT groups_subjects.* FROM groups_subjects 
			LEFT JOIN subjects ON subjects.id = subject_id
			WHERE teacher_id = $1
		) groups_subjects ON groups_subjects.group_id = groups.id
		WHERE captain_id = $1
		GROUP BY groups.id
	`, [ teacher_id ])

	const responseOther = await db.query(`
		SELECT groups.* FROM groups 
		LEFT JOIN groups_teacher ON groups.id = groups_teacher.group_id
		WHERE captain_id IS DISTINCT FROM $1
	`, [ teacher_id ])

	const responseRequest = await db.query(`
		SELECT * FROM groups_requests WHERE teacher_id = $1
	`, [ teacher_id ])

	return { own: responseOwn.rows, other: responseOther.rows, requests: responseRequest.rows }
}

async function getUserGroups (db, student_id){
	const responseMy = await db.query(
		`SELECT groups.* FROM students_groups LEFT JOIN groups ON group_id = groups.id WHERE student_id = $1`,
		[ student_id ]
	)

	return { my: responseMy.rows }
}

async function createGroup(db, title, subjects, teacher_id){

	const client = await db.connect()

	try {
		await client.query('BEGIN')

		const url = await getUrl(title, client, 'groups')

		const response = await client.query(
			`INSERT INTO groups VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id`, 
			[ title, url, teacher_id, Date.now() ]
		)
		const group_id = response.rows[0].id
		
		const responseSubjects = await client.query (
			`INSERT INTO groups_subjects (SELECT $1 AS group_id, unnest($2::int[]) AS subject_id)`,
			[ group_id, subjects ]
		)
		
		await client.query('COMMIT')
		
		return { url }
	} catch(e){
		console.log(e)
		await client.query('ROLLBACK')
		return {error: "db error"}
	}
}

async function editGroup (db, url, title, subjects, teacher_id){
	const group_response = await db.query('SELECT id, captain_id FROM groups WHERE url = $1', [url])
	if(group_response.rowCount === 0) return { error: "wrong url" }

	const { id, captain_id } = group_response.rows[0]

	//Если препод - создатель группы, то изменяем также и название группы. Иначе меняем только предметы
	if(captain_id === teacher_id){


		const deleteResponse = await db.query(`DELETE FROM groups_subjects WHERE group_id = $1 AND subject_id=ANY(
			SELECT id FROM subjects WHERE teacher_id = $2 AND (array_length($3::int[], 1) IS NULL OR id != ANY ($3))
		)`, [ id, teacher_id, subjects ])

		const insertResponse = await db.query(
			`INSERT INTO groups_subjects (SELECT $1 AS group_id, unnest($2::int[]) AS subject_id) ON CONFLICT DO NOTHING`,
			[ id, subjects ]
		)

		return { deleted: deleteResponse.rowCount, inserted: insertResponse.rowCount }
	}
}

async function deleteGroup (db, id, captain_id){
	const response = await db.query('DELETE FROM groups WHERE id=$1 AND captain_id=$2', [ id, captain_id ])
	if(response.rowCount > 0)
		await db.query('DELETE FROM groups_subjects WHERE group_id=$1', [ id ])

	return { count: response.rowCount }
}