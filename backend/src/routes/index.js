const bodyParser = require('body-parser')
const db = require('../db')
const cookieParser = require('cookie-parser')
const getUserData = require('../libs/get-user-data')

//Импортируем все файлы с роутами
const baseRoutes = require('./base')
const authRoutes = require('./auth')
const subjectRoutes = require('./subjects')
const workRoutes = require('./works')
const groupRoutes = require('./groups')
const studentRoutes = require('./students')
const commitRoutes = require('./commits')

const uploadRoutes = require('./upload')

module.exports = function (app, db) {

	app.use(bodyParser.json())
	app.use(cookieParser())

	authRoutes(app, db)

	app.use(getUserData(db))

	baseRoutes(app, db)
	subjectRoutes(app, db)
	workRoutes(app, db)
	groupRoutes(app, db)
	studentRoutes(app, db)
	commitRoutes(app, db)

	uploadRoutes(app, db)
	
	// Тут, позже, будут и другие обработчики маршрутов 
}