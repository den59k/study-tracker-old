const fs = require('fs')
const nanoid = require('nanoid').nanoid;
const mime = require('mime');
const { base } = require('../libs/path')

module.exports = function(app, db){

	app.post('/upload', async(req, res) => {
		if(req.body === {}) return res.json({error: "wrong body"})
	
		const mimeType = req.headers['content-type']

		const path = '/db/temp/'+nanoid(20)+'.'+mime.getExtension(mimeType)
		await fs.promises.writeFile(base(path), req.body)

		res.json({src: path})
	})

}