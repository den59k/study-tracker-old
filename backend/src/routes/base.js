const { validate, safe } = require('../libs/validate')

module.exports = function(app, db) {
	
	app.get('/', async(req, res) => {
		
		const user = req.user;

		res.json(user)
	})
}
