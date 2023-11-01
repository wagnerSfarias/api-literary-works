import { v4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      date_of_birth: Yup.date().required(),
      gender: Yup.string().required(),
      document: Yup.string().required(),
      university: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const {
      name,
      email,
      password,
      date_of_birth,
      gender,
      document,
      university,
    } = request.body

    const emailExists = await User.findOne({
      where: { email },
    })

    if (emailExists) {
      return response.status(409).json({ error: 'User already exist' })
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      date_of_birth,
      gender,
      document,
      university,
    })

    return response.status(201).json({ id: user.id, name, email })
  }
}

export default new UserController()
