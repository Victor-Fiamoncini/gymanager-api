import { Op } from 'sequelize'
import { Student } from '../models'

import customMessage from '../messages/customMessage'
import { students as studentsErrors } from '../messages/errors'
import { students as studentsSuccess } from '../messages/success'

class StudentController {
	async index(req, res) {
		const { name = '', page = 1 } = req.query

		const students = await Student.findAll({
			where: { name: { [Op.like]: `%${name}%` } },
			attributes: ['id', 'name', 'age', 'weight', 'height'],
			offset: (page - 1) * 10,
			limit: 10,
		})

		if (!students) {
			return res.status(404).json(customMessage(studentsErrors.notFoundIndex))
		}

		return res.status(200).json(students)
	}

	async show(req, res) {
		const { id } = req.params

		const student = await Student.findOne({
			where: { id },
			attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
		})

		if (!student) {
			return res.status(404).json(customMessage(studentsErrors.notFound, 'id'))
		}

		return res.status(200).json(student)
	}

	async store(req, res) {
		const { email } = req.body

		if (await Student.findOne({ where: { email } })) {
			return res
				.status(404)
				.json(customMessage(studentsErrors.alreadyExists, 'email'))
		}

		const { id, name, age, height, weight } = await Student.create(req.body)

		return res.status(201).json({ id, name, age, height, weight })
	}

	async update(req, res) {
		const studentById = await Student.findByPk(req.params.id)

		if (!studentById) {
			return res.status(404).json(customMessage(studentsErrors.notFound, 'id'))
		}

		const studentByEmail = await Student.findOne({
			where: { email: req.body.email },
		})

		if (studentByEmail && studentById.email !== studentByEmail.email) {
			return res
				.status(404)
				.json(customMessage(studentsErrors.alreadyExists, 'email'))
		}

		const { id, name, age, height, weight } = await studentById.update(
			req.body,
			{
				where: { id: req.params.id },
			}
		)

		return res.status(200).json({ id, name, age, height, weight })
	}

	async destroy(req, res) {
		const student = await Student.findByPk(req.params.id)
		if (!student) {
			return res.status(404).json(customMessage(studentsErrors.notFound, 'id'))
		}

		await student.destroy()
		return res.status(200).json({ success: studentsSuccess.deleted })
	}
}

export default new StudentController()