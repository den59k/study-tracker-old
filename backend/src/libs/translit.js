const cyrillicToTranslit = require('cyrillic-to-translit-js')

const reg = /[^a-zA-Z0-9-]/g

function toTranslit (str) {
	const latin = cyrillicToTranslit().transform(str.toLowerCase(), '-').replace(reg, '')
	return latin
}

// Функция поиска УРЛ в заданной таблице
async function getUrl (str, db, tablename){

	const url = toTranslit(str)
	const names = await db.query(`
		SELECT url FROM ${tablename} 
		WHERE url=$1 OR url LIKE $1 || '-_' 
		ORDER BY url LIMIT 10
	`, [ url ])

	let newUrl = url

	for(let i = 0; i < names.rowCount; i++){
		if(names.rows[i].url !== newUrl) break
		newUrl = url + '-'+ (i + 1)
	}		
	console.log(newUrl)
	return newUrl
}

module.exports = { toTranslit, getUrl }