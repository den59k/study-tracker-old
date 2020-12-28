const Ajv = require('ajv').default
const ajv = new Ajv()

function validate(schema){
	return function(req, res, next){
		if(!schema.type) schema.type = "object"

		if(!req.body || !ajv.validate(schema, req.body)){
			res.statusCode = 400;
			res.json({error: "wrong request"});
			return;
		}

		next();
	}
}

//Функция для обработки ошибок
function safe (callback) {
	return async (req, res) => {
		callback(req, res)
		.catch(e => {
			console.log(e)
			res.statusCode = 406
			
			if(e.code === '23505') return res.json({error: "exists"})

			res.json({error: "ERROR"})
		})
	}
}

module.exports = { validate, safe }