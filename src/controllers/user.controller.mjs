import { users } from '../models/user.model.mjs'

export const getUsers = ('/', (req, res) => {
    const result = Array.from(users.entries()).map(([id, data]) => ({
        id,
        ...data,
    }))
    res.status(200).json(result)
})

export const createUser =(req, res) => {
    const { name } = req.body || {}
    const id = Date.now().toString()
    const trimmedName = name.trim()
    users.set(id, {'name': trimmedName})

    res.status(201).send(`User created: ${id} - ${trimmedName}`)
}

export const getUserById = (req, res) => {
    const { userId } = req.params

    if (!users.has(userId)) {
        return res.status(404).send('Not Found')
    }

    const user = users.get(userId)
    res.status(200).send(`User ${userId}: ${user.name}`)
}

export const updateUser = (req, res) => {
    const { userId } = req.params
    const { name } = req.body || {}

    if (!users.has(userId)) {
        return res.status(404).send('Not Found')
    }

    const trimmedName = name.trim()
    users.set(userId, {'name': trimmedName})

    res.status(200).send(`User updated: ${userId} - ${trimmedName}`)
}

export const deleteUser = (req, res) => {
    const { userId } = req.params

    if (!users.has(userId)) {
        return res.status(404).send('Not Found')
    }

    users.delete(userId)
    res.status(204).send()
}