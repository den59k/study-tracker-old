module.exports = function(app, db) {
	app.get(['/blocks/:page/:block', '/blocks/:page/:block/:lang'], async (req, res) => {
			const block = await getBlock(db, req.params)
			res.json(block)
	})

	app.put('/blocks/:page/:block/:lang', async (req, res) => {

		const resp = await putBlock(db, req.params, req.body)
		res.json(resp)
	})
}

//Эти функции просто, чтобы не выносить в отдельный файл - почему бы и нет
async function putBlock(db, query, value){
	const collection = db.collection('blocks')

	if(!query.lang) query.lang = "ru"

	const res = await collection.replaceOne(query, { ...query, value }, { upsert: true })

	return { updated: res.modifiedCount, upserted: res.upsertedCount }
}

async function getBlock(db, query){
	const collection = db.collection('blocks')
	if(!query.lang) query.lang = "ru"

	const block = await collection.findOne(query, { projection: { value: 1 }})
	
	if(block) return block.value
	return {}
}