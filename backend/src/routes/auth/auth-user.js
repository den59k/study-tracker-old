const { nanoid } = require('nanoid')

module.exports = async function AuthUser(email, password, db){
	const response = await db.query(
		`SELECT password = digest($2, 'sha1') true_password, user_id, token FROM accounts WHERE email=$1`, 
		[ email, password ]
	)

	if(response.rowCount === 0) return { error: { email: "Нет такого email" } }
	const { user_id, true_password, token } = response.rows[0]

	if(true_password === false) return { error: { password: "Неверный пароль" } } 
	
	if(token !== null) return { token }

	//Если токена нет - создаем его
	const newToken = nanoid(30)
	const response2 = await db.query(
		'UPDATE accounts SET token=$2, last_login_time=$3 WHERE user_id=$1', 
		[ user_id, newToken, Date.now() ]
	)

	return { token: newToken }
}