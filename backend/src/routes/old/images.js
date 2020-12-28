const fs = require('fs')
const sharp = require('sharp')
const nanoid = require('nanoid').nanoid;
const mime = require('mime');

const { base } = require('../libs/path')

module.exports = function(app, db) {

	app.post(['/images', '/images/:type'], async (req, res) => {
		if(req.body === {}) return res.json({error: "wrong body"})

		const type = req.params.type || 'no-resize'
		const mimeType = req.headers['content-type']

		const path = '/db/temp/'+nanoid(20)+'.'+mime.getExtension(mimeType)
		await fs.promises.writeFile(base(path), req.body)

		res.json({src: path})
	})

}