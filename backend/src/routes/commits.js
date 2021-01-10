module.exports = function(app, db) {
	
	app.get('/progress', async(req, res) => {
		const { id, role } = req.user
		if(role === 'teacher'){
			const subjects = await getTeacherSubjects(db, id)
			const titles = await getTeacherSubjectTitles(db, id)
			res.json({ subjects, titles })
		}
	})

	app.get('/progress/:url', async(req, res) => {
		const [ group_url, subject_url ] = req.params.url.split('_')

		if(!subject_url) return res.json({error: "wrong subject_url"})

		const response = await getStudents(db, group_url, subject_url)
		
		res.json(response)
	})

}

async function getTeacherSubjects (db, teacher_id){
	const response = await db.query(`
		SELECT 
			groups.id AS group_id, groups.title AS group_title, groups.url AS group_url,
			subjects.id AS subject_id, subjects.title AS subject_title, subjects.url AS subject_url
		FROM groups_subjects
		LEFT JOIN subjects ON subjects.id = subject_id
		LEFT JOIN groups ON groups.id = group_id
		WHERE teacher_id = $1
		ORDER BY groups.title
	`, [ teacher_id ])

	return response.rows
}

async function getTeacherSubjectTitles (db, teacher_id){
	const response = await db.query(`
		SELECT DISTINCT title, url FROM groups_subjects
		LEFT JOIN subjects ON subjects.id = subject_id
		WHERE teacher_id = $1
		ORDER BY title
	`, [ teacher_id ])

	return response.rows
}

async function getStudents(db, group_url, subject_url) {
	const response = await db.query(`
		SELECT users.id, users.name, users.surname, users.id, users.avatar FROM students_groups
		LEFT JOIN groups ON group_id = groups.id
		LEFT JOIN users ON student_id = users.id
		WHERE groups.url=$1
		ORDER BY surname, name 
	`, [ group_url ])

	return response.rows
}