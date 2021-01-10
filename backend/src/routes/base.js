const { base } = require('../libs/path')
const { validate, safe } = require('../libs/validate')
const { nanoid } = require('nanoid')
const sharp = require('sharp')

const properties = {
	name: { type: "string" },
	surname: { type: "string" },
	avatar_full: { type: "string" }
}

const postSchema = { properties, required: [ 'name', 'surname' ] }

const avatarResize = { width: 40, height: 40, fit: 'cover' }
const avatarFullResize = { width: 256, height: 256, fit: 'cover' }

module.exports = function(app, db) {
	
	app.get('/', async(req, res) => {
		
		const user = req.user;
		const data = await db.query(
			'SELECT name, surname, avatar, avatar_full FROM users WHERE id=$1',
			[ user.id ]
		)

		res.json({...user, ...data.rows[0]})
	})

	app.put('/', validate(postSchema), async(req, res) => {
		const { name, surname, avatar_full } = req.body
		const { id } = req.user

		if(avatar_full && avatar_full.startsWith('/db/temp')){
			const fileName = nanoid(30)
			const avatarPath = `/db/images/${fileName}.jpg`
			const avatarFullPath = `/db/images/${fileName}-full.jpg`

			await sharp(base(avatar_full)).rotate().resize(avatarResize).jpeg({quality: 75}).toFile(base(avatarPath))
			await sharp(base(avatar_full)).rotate().resize(avatarFullResize).jpeg({quality: 75}).toFile(base(avatarFullPath))
			
			const response = await db.query(
				'UPDATE users SET name=$2, surname=$3, avatar=$4, avatar_full=$5 WHERE id=$1', 
				[ id, name, surname, avatarPath, avatarFullPath ]
			)
		
			res.json({count: response.rowCount})
		}else{
			
			const response = await db.query('UPDATE users SET name=$2, surname=$3 WHERE id=$1', [ id, name, surname ])
			res.json({count: response.rowCount})
		}

	})
}
