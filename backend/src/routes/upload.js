const bodyParser = require('body-parser')
const fs = require('fs')
const nanoid = require('nanoid').nanoid;
const mime = require('mime');
const { base } = require('../libs/path')

module.exports = function(app, db){

	app.use('/upload', bodyParser.raw({ limit: '5mb', type: '*/*' }))

	app.post('/upload', async(req, res) => {
		
		if(req.body === {}) return res.json({error: "wrong body"})
	
		const mimeType = req.headers['content-type']

		const path = '/db/temp/'+nanoid(20)+'.'+mime.getExtension(mimeType)
		await fs.promises.writeFile(base(path), req.body)

		res.json({src: path})
	})

}