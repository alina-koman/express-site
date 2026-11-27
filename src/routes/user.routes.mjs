import { Router } from 'express';
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.mjs'
import { basicAuth } from '../middlewares/auth.middleware.mjs';
import { validationMiddleware } from '../middlewares/validation.middleware.mjs';

const router = new Router()

router.use(basicAuth)

router.get('/', getUsers)
router.post('/', validationMiddleware, createUser)
router.get('/:userId', getUserById)
router.put('/:userId', validationMiddleware, updateUser)
router.delete('/:userId', deleteUser)

export default router