import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import Database from './app/config/Database'
import routes from './routes'

/**
 * @class App
 */
export default class App {
	private express: Application

	public constructor() {
		this.express = express()

		this.middlewares()
		this.database()
	}

	get app(): Application {
		return this.express
	}

	private middlewares(): void {
		this.express.use(express.json())
		this.express.use(morgan('dev'))
		this.express.use(cors())

		this.express.use(routes)
	}

	private database(): void {
		const database = new Database(
			process.env.DB_HOST,
			process.env.DB_PORT,
			process.env.DB_USER,
			process.env.DB_PASS,
			process.env.DB_DATABASE
		)

		database.connect()
	}
}