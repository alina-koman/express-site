import { Router } from 'express';
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.mjs'

const router = new Router()

router.get('/', getUsers)
router.post('/', createUser)
router.get('/:userId', getUserById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)

export default router