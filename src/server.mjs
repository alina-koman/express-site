// Реалізація EXPRESS сервера відповідно до завдання, описаного у файлі ASSIGNMENT.md
// Імпортуємо необхідні модулі
import express from 'express'
import router from './routes/index.mjs'

// Створюємо EXPRESS сервер
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(router)

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
