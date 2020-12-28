const bodyParser = require('body-parser')
const db = require('../db')
const cookieParser = require('cookie-parser')
const getUserData = require('../libs/get-user-data')

//Импортируем все файлы с роутами
const baseRoutes = require('./base')
const authRoutes = require('./auth')
const subjectRoutes = require('./subjects')

module.exports = function (app, db) {

	app.use(bodyParser.json())
	app.use(bodyParser.raw({ limit: '5mb', type: 'image/*' }))
	app.use(cookieParser())

	authRoutes(app, db)

	app.use(getUserData(db))

	baseRoutes(app, db)
	subjectRoutes(app, db)
	
	// Тут, позже, будут и другие обработчики маршрутов 
}