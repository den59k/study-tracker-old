const cyrillicToTranslit = require('cyrillic-to-translit-js')

const reg = /[^a-zA-Z0-9-_]/g

module.exports = function (str) {
	const latin = cyrillicToTranslit().transform(str.toLowerCase(), '-').replace(reg, '')
	return latin
}