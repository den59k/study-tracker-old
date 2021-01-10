const { validate, safe } = require('../libs/validate')
const { getUrl } = require('../libs/translit')

const properties = {
	work: { type: "integer" },
	text: { type: "string" },
	mark: { type: "integer" },
	files: { type: "array" }
}

const postSchema = { properties, required: [ 'work' ] }

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

	app.get('/progress/:url/:student_id', async(req, res) => {
		const [ group_url, subject_url ] = req.params.url.split('_')
		if(!subject_url) return res.json({error: "wrong subject_url"})

		const student_id = parseInt(req.params.student_id)
		if(isNaN(student_id)) return res.json({ error: "wrong student_id" })

		const student = await findStudent(db, student_id)
		if(!student) return res.json({error: "wrong student"})

		const works = await getWorks(db, subject_url)
		if(!works) return res.json({error: "wrong works"})
		
		const commits = await getCommits(db, subject_url, student_id)

		res.json({student, works, commits})
	})

	app.post('/progress/:url/:student_id', validate(postSchema), async(req, res) => {
		const [ group_url, subject_url ] = req.params.url.split('_')
		if(!subject_url) return res.json({error: "wrong subject_url"})

		const student_id = parseInt(req.params.student_id)
		if(isNaN(student_id)) return res.json({ error: "wrong student_id" })

		const { mark, work, text, files } = req.body

		console.log(files)

		if(mark){
			const response = await addCommitMark(db, work, student_id, req.user.id,  text, files, mark)
			res.json(response)
		}else{
			const response = await addCommit(db, work, student_id, req.user.id, text, files)
			res.json(response)
		}
		
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

async function findStudent(db, student_id){
	const response = await db.query('SELECT name, surname FROM users WHERE id=$1', [ student_id ])
	return response.rows[0]
}

async function getWorks(db, subject_url){
	const response = await db.query(`
		SELECT works.id, works.title FROM works 
		LEFT JOIN subjects ON subject_id = subjects.id
		WHERE subjects.url=$1
	`, [ subject_url ])

	return response.rows
}

async function getCommits (db, subject_url, student_id) {
	const response = await db.query(`
		SELECT commits.*, works.title, name, surname, avatar FROM commits
		LEFT JOIN users ON user_id = users.id
		LEFT JOIN works ON work_id = works.id
		LEFT JOIN subjects ON subject_id = subjects.id
		WHERE student_id = $1 AND subjects.url = $2 
		ORDER BY commits.timestep DESC
	`, [ student_id, subject_url ])

	return response.rows
}

async function addCommit (db, work_id, student_id, user_id, text, files){
	const response = await db.query(
		`INSERT INTO commits VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)`,
		[ work_id, student_id, user_id, text, files || null, Date.now() ]
	)

	return { count: response.rowCount }
}

async function addCommitMark (db, work_id, student_id, user_id, text, files, mark){
	const response = await db.query(
		`INSERT INTO commits VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)`,
		[ work_id, student_id, user_id, text, files || null, Date.now(), mark ]
	)

	return { count: response.rowCount }
}