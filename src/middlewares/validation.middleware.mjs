export const validationMiddleware = (req, res, next) => {
    const { name } = req.body || {}
    if (typeof name !== 'string' || !name.trim().length === 0) {
        return res.status(400).send('Bad Request: User name must be a non-empty string')
    }

    req.body.name = name.trim()
    next()
}

export const validateArticleData = (req, res, next) => {
    const { title } = req.body || {}
    if (typeof title !== 'string' || !title.trim().length === 0) {
        return res.status(400).send('Bad Request: User title must be a non-empty string')
    }

    req.body.title = title.trim()
    next()
}