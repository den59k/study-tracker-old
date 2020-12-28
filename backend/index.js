require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const db = require('./src/db')

const routeApp = require('./src/routes')

const app = express()
const port = process.env.PORT || 3001

async function init (){

  const router = express.Router()
  routeApp(router, db)

  app.use('/api', router)

  //Мы должны редиректить данные из базы, чтобы выводить их
  //app.use('/db', express.static(base('db')))
  app.use(express.static('public'))

  //Обработка ошибок
  app.use(function(err, _req, res, _next) {
		console.log("ERROR")
		res.json({error: "error"})
	})

  app.listen(port, () => console.log(chalk.green(`Success app listening at http://localhost:${port}`)))
}

init()
