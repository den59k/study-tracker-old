const loginRoutes = require('./login')
const registerRoutes = require('./register')
const confirmRoutes =  require('./confirm')

module.exports = function (app, db) {
	loginRoutes(app, db)
	registerRoutes(app, db)
	confirmRoutes(app, db)
}