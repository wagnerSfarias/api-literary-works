import { Router } from 'express'
import multer from 'multer'
import authMiddlewares from './app/middlewares/auth'

import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import PublicationController from './app/controllers/PublicationController'

const routes = Router()
const upload = multer(multerConfig)

routes.post('/user', UserController.store)
routes.post('/sessions', SessionController.store)
routes.post(
  '/publication',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  PublicationController.store,
)

routes.get('/publications', PublicationController.index)
routes.use(authMiddlewares)
routes.put('/publication/:id', PublicationController.update)

export default routes
