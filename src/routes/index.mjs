import { Router } from 'express'
import { getRoot } from '../controllers/root.controller.mjs'
import { loggerMiddleware } from '../middlewares/logger.middleware.mjs'
import userRoutes from './user.routes.mjs'
import articleRoutes from './article.routes.mjs'

const router = new Router()

router.get('/', loggerMiddleware, getRoot)
router.use('/users', userRoutes)
router.use('/articles', articleRoutes)

export default router