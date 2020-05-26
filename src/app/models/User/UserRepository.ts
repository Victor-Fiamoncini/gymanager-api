import { EntityRepository, Repository } from 'typeorm'
import User from './User'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	public async store(dto: object) {
		return await this.manager.create(User, dto).save()
	}

	// public async updateById(id: number, existingProperties: object, dto: object) {
	// 	return await this.manager.update({ id }, existingProperties, dto)
	// }

	public async findByEmail(email: string) {
		return await this.findOne(
			{ email },
			{ select: ['id', 'name', 'email', 'password'] }
		)
	}
}