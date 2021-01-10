function getUserData (db) {

	return async (req, res, next) => {
		const { token } = req.cookies
		if(!token) return res.json({error: "wrong token"})
		
		const response = await db.query(
			`SELECT user_id AS id, role, email FROM accounts WHERE token=$1`,
			[ token ] 
		)

		if(response.rowCount === 0) return res.json({error: "wrong token"})

		req.user = response.rows[0]
		next()
	}
}

module.exports = getUserData