import * as Yup from 'yup'
import User from '../models/User'
import Publication from '../models/Publication'
import { unlink } from 'node:fs'

class PublicationController {
  async store(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      date_publication: Yup.string().required(),
      subject: Yup.string().required(),
      language: Yup.string().required(),
      license: Yup.boolean().required(),
      user_id: Yup.string().required(),
    })
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { title, date_publication, subject, language, license, user_id } =
      request.body

    let url_image
    let url_file

    if (request.files.image) {
      url_image = request.files.image[0].filename
    }
    if (request.files.file) {
      url_file = request.files.file[0].filename
    }
    const userExists = await User.findOne({
      where: { id: user_id },
    })

    if (!userExists) {
      unlink(`uploads/${url_image}`, (err) => {
        if (err) {
          console.log('Erro', err)
        }
        console.log(`${url_image}, was deleted`)
      })

      unlink(`uploads/${url_file}`, (err) => {
        if (err) {
          console.log('Erro', err)
        }
        console.log(`${url_file}, was deleted`)
      })
      return response
        .status(401)
        .json({ error: 'Make sure your user ID is correct' })
    }

    const publication = await Publication.create({
      title,
      date_publication,
      subject,
      language,
      license,
      url_image,
      url_file,
      user_id,
    })

    return response.json(publication)
  }

  async index(request, response) {
    const publications = await Publication.findAll()

    return response.json(publications)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      date_publication: Yup.string(),
      subject: Yup.string(),
      language: Yup.string(),
      license: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { title, date_publication, subject, language, license } = request.body
    const { id } = request.params

    const publication = await Publication.findByPk(id)

    if (!publication) {
      return response
        .status(401)
        .json({ error: 'Make sure your publication ID is correct' })
    }
    if (request.userId !== publication.user_id) {
      return response.status(401).json({ error: 'You cannot change this post' })
    }

    let url_image
    let url_file

    if (request.files.image) {
      url_image = request.files.image[0].filename
    }
    if (request.files.file) {
      url_file = request.files.file[0].filename
    }
    await Publication.update(
      {
        title,
        date_publication,
        subject,
        language,
        license,
        url_image,
        url_file,
      },
      {
        where: { id },
      },
    )
    return response.json({ message: 'changed publication' })
  }
}

export default new PublicationController()
