import { DataTypes, Model } from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class User extends Model {
	static init(connection) {
		super.init(
			{
				name: DataTypes.STRING,
				email: DataTypes.STRING,
				password: DataTypes.STRING,
				photo: DataTypes.STRING,
				photo_url: DataTypes.STRING,
			},
			{
				sequelize: connection,
			}
		)

		this.addHook('beforeSave', async (user) => {
			if (user.password) {
				user.password = await bcrypt.hash(user.password, 10)
			}
		})

		return this
	}

	async matchPassword(password) {
		return await bcrypt.compare(password, this.password)
	}

	generateToken() {
		const { JWT_AUTH_SECRET, JWT_EXPIRES } = process.env

		return jwt.sign({ id: this.id }, JWT_AUTH_SECRET, {
			expiresIn: Number(JWT_EXPIRES),
		})
	}
}
