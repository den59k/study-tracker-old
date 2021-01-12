const { validate, safe } = require('../libs/validate')
const { getUrl } = require('../libs/translit')

const properties = {
	title: { type: "string" },
	subjects: { type: "array" },
	email: { type: "string" }
}

const postSchema = { properties, required: [ "title" ] }
const postOtherSchema = { properties, required: [ 'email' ] }
const schema = { properties }

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
		if(req.user.role === 'teacher'){
			const response = await createTeacherGroup(db, title, subjects, req.user.id)
			res.json(response)
		}
		if(req.user.role === 'student'){
			const response = await createStudentGroup(db, title, req.user.id)
			res.json(response)
		}
	})

	app.post('/groups/other', validate(postOtherSchema), async(req, res) => {
		const { email, subjects } = req.body

		if(req.user.role === 'teacher'){
			const response = await addGroupFromCaptain(db, req.user.id, email, subjects)

			return res.json(response)
		}

		res.json({count: 1})
	})

	app.put('/groups/:url', validate(schema), async(req, res) => {
		const { title, subjects } = req.body
		const { url } = req.params
		if(req.user.role === 'teacher'){
			const response = await editGroup(db, url, title, req.user.id, subjects)
			res.json(response)
		}

		if(req.user.role === 'student'){
			const response = await editGroup(db, url, title, req.user.id)
			res.json(response)
		}
		
	})

	app.delete('/groups/:url', async(req, res) => {
		const { url } = req.params
		const groupResponse = await db.query('SELECT id, captain_id FROM groups WHERE url=$1', [ url ])
		
		if(groupResponse.rowCount === 0) return res.json({error: "wrong url"})
		
		const { id, captain_id } = groupResponse.rows[0]

		if(captain_id === req.user.id){
			const response = await deleteGroup(db, id)
			return res.json(response)
		} else {
			//Если это студент - то он выходит из группы
			if(req.user.role === 'student'){
				const response = await exitGroup(db, id, req.user.id)
				return res.json(response)
			}

			if(req.user.role === 'teacher'){
				const response = await exitTeacherGroup(db, id, req.user.id)
				return res.json(response)
			}
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
		SELECT groups.*, array_remove(array_agg(subject_id), NULL) AS subjects FROM groups 
		LEFT JOIN (
			SELECT groups_subjects.* FROM groups_subjects 
			LEFT JOIN subjects ON subjects.id = subject_id
			WHERE teacher_id = $1
		) groups_subjects ON groups_subjects.group_id = groups.id
		LEFT JOIN groups_teachers ON groups.id = groups_teachers.group_id
		WHERE captain_id != $1 AND teacher_id = $1
		GROUP BY groups.id
	`, [ teacher_id ])

	return { own: responseOwn.rows, other: responseOther.rows }
}

async function getUserGroups (db, student_id){

	const responseOwn = await db.query(`
		SELECT groups.*, COUNT(students_groups) FROM groups
		LEFT JOIN students_groups ON group_id = groups.id
		WHERE captain_id = $1
		GROUP BY groups.id
	`, [ student_id ])

	const responseMy = await db.query(`
		SELECT groups.*, group_counts.count FROM groups
		LEFT JOIN students_groups ON group_id = groups.id
		LEFT JOIN (
			SELECT group_id AS id, COUNT (*) FROM students_groups GROUP BY group_id
		) group_counts ON group_counts.id = groups.id
		WHERE student_id = $1 AND captain_id != $1
	`, [ student_id ]	)

	return { my: responseMy.rows, own: responseOwn.rows }
}

async function createTeacherGroup(db, title, subjects, teacher_id){

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

async function createStudentGroup (db, title, user_id){
	const url = await getUrl(title, db, 'groups')

	const response = await db.query(
		`INSERT INTO groups VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id`, 
		[ title, url, user_id, Date.now() ]
	)
	const group_id = response.rows[0].id

	//Когда мы создаем группу от студента - мы также добавляем его самого
	const response2 = await db.query(
		`INSERT INTO students_groups VALUES ($1, $2)`,
		[ user_id, group_id ]
	)

	return { url }
}

async function editGroup (db, url, title, teacher_id, subjects){
	const group_response = await db.query('SELECT id, captain_id, title FROM groups WHERE url = $1', [url])
	if(group_response.rowCount === 0) return { error: "wrong url" }

	const { id, captain_id, title: oldTitle } = group_response.rows[0]

	//Если препод - создатель группы, то изменяем также и название группы. Иначе меняем только предметы
	if(captain_id === teacher_id && oldTitle !== title && title.length > 2){
		url = await getUrl(title, db, 'groups')

		await db.query('UPDATE groups SET title = $2, url=$3 WHERE id=$1', [ id, title, url ])
	}

	if(subjects){
		const deleteResponse = await db.query(`DELETE FROM groups_subjects WHERE group_id = $1 AND subject_id=ANY(
			SELECT id FROM subjects WHERE teacher_id = $2 AND (array_length($3::int[], 1) IS NULL OR id != ANY ($3))
		)`, [ id, teacher_id, subjects ])

		const insertResponse = await db.query(
			`INSERT INTO groups_subjects (SELECT $1 AS group_id, unnest($2::int[]) AS subject_id) ON CONFLICT DO NOTHING`,
			[ id, subjects ]
		)

		//return { deleted: deleteResponse.rowCount, inserted: insertResponse.rowCount }
	}

	return { url }
}

async function addGroupFromCaptain (db, teacher_id, email, subjects) {
	
	const group_response = await db.query(`
		SELECT groups.id FROM groups
		LEFT JOIN accounts ON accounts.user_id = groups.captain_id
		WHERE email = $1
	`, [ email ])

	if(group_response.rowCount === 0) return res.json({error: "wrong email"})

	const { id } = group_response.rows[0]

	const response = await db.query(`
		INSERT INTO groups_teachers VALUES ($1, $2)
	`, [ id, teacher_id ])

	if(subjects && subjects.length > 0){
		const responseSubjects = await db.query (
			`INSERT INTO groups_subjects (SELECT $1 AS group_id, unnest($2::int[]) AS subject_id)`,
			[ id, subjects ]
		)
	}

	return { count: response.rowCount }
}

async function deleteGroup (db, group_id){
	const response = await db.query('DELETE FROM groups WHERE id=$1', [ group_id ])
	if(response.rowCount > 0)
		await db.query('DELETE FROM groups_subjects WHERE group_id=$1', [ group_id ])

	return { count: response.rowCount }
}

async function exitGroup (db, group_id, student_id){
	const response = await db.query(
		'DELETE FROM students_groups WHERE student_id = $1 AND group_id = $2',
		[ student_id, group_id ]
	)

	return { count: response.rowCount }
}

async function exitTeacherGroup (db, group_id, teacher_id){
	const response = await db.query(
		'DELETE FROM groups_teachers WHERE group_id = $1 AND teacher_id = $2',
		[ group_id, teacher_id ]
	)

	if(response.rowCount > 0)
		await db.query('DELETE FROM groups_subjects WHERE group_id=$1', [ group_id ])

	return { count: response.rowCount }
}