// Реалізація EXPRESS сервера відповідно до завдання, описаного у файлі ASSIGNMENT.md
// Імпортуємо необхідні модулі
import express from 'express'

// Створюємо EXPRESS сервер
const app = express()
const PORT = process.env.PORT || 3000
const userRoutes = express.Router()
const articleRoutes = express.Router()

app.use(express.json())

const users = new Map([
    ['1', {'name': 'John'}],
])

const articles = new Map([
    ['1', {'title': 'Getting Started with Express'}],
])

const isNotEmptyString = (value) => value && typeof value === 'string' && value.trim().length > 0

userRoutes.get('/', (req, res) => {
    const result = Array.from(users.entries()).map(([id, data]) => ({
        id,
        ...data,
    }))
    res.status(200).json(result)
})

userRoutes.post('/', (req, res) => {
    const { name } = req.body || {}

    if (!isNotEmptyString(name)) {
        return res.status(400).send('Bad Request')
    }

    const id = Date.now().toString()
    const trimmeName = name.trim()
    users.set(id, {'name': trimmeName})

    res.status(201).json({id, 'name': trimmeName})
})

userRoutes.get('/:userId', (req, res) => {
    const { userId } = req.params

    if (!users.has(userId)) {
        return res.status(404).send('Not Found')
    }

    res.status(200).json({ id: userId, ...users.get(userId) })
})

userRoutes.put('/:userId', (req, res) => {
    const { userId } = req.params
    const { name } = req.body || {}

    if (!isNotEmptyString(name)) {
        return res.status(400).send('Bad Request')
    }

    if (!users.has(userId)) {
        return res.status(404).send('Not Found')
    }

    const trimmeName = name.trim()
    users.set(userId, {'name': trimmeName})

    res.status(200).json({ id: userId, name: trimmeName })
})

userRoutes.delete('/:userId', (req, res) => {
    const { userId } = req.params

    if (!users.has(userId)) {
        return res.status(404).send('Not Found')
    }

    users.delete(userId)
    res.status(204).send()
})

articleRoutes.get('/', (req, res) => {
    const result = Array.from(articles.entries()).map(([id, data]) => ({
        id,
        ...data,
    }))
    res.status(200).json(result)
})

articleRoutes.post('/', (req, res) => {
    const { title } = req.body || {}

    if (!isNotEmptyString(title)) {
        return res.status(400).send('Bad Request')
    }

    const id = Date.now().toString()
    const trimmeTitle = title.trim()
    articles.set(id, {'title': trimmeTitle})

    res.status(201).json({id, 'title': trimmeTitle})
})

articleRoutes.get('/:articleId', (req, res) => {
    const { articleId } = req.params

    if (!articles.has(articleId)) {
        return res.status(404).send('Not Found')
    }

    res.status(200).json({ id: articleId, ...articles.get(articleId) })
})

articleRoutes.put('/:articleId', (req, res) => {
    const { articleId } = req.params
    const { title } = req.body || {}

    if (!isNotEmptyString(title)) {
        return res.status(400).send('Bad Request')
    }

    if (!articles.has(articleId)) {
        return res.status(404).send('Not Found')
    }

    const trimmeTitle = title.trim()
    articles.set(articleId, {'title': trimmeTitle})

    res.status(200).json({ id: articleId, title: trimmeTitle })
})

articleRoutes.delete('/:articleId', (req, res) => {
    const { articleId } = req.params

    if (!articles.has(articleId)) {
        return res.status(404).send('Not Found')
    }

    articles.delete(articleId)
    res.status(204).send()
})

app.get('/', (req, res) => {
    res.status(200).send('Get root route')
})
app.use('/users', userRoutes)
app.use('/articles', articleRoutes)

app.get('/error-test', (req, res, next) => {
    next(new Error('Test error'))
})

app.use((req, res) => {
    res.status(404).send('Not Found')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal Server Error')
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// Експорт для тестів
export { server, app };
