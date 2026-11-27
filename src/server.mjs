// Реалізація EXPRESS сервера відповідно до завдання, описаного у файлі ASSIGNMENT.md
// Імпортуємо необхідні модулі
import express from 'express'
import router from './routes/index.mjs'
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.mjs'

// Створюємо EXPRESS сервер
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        }
    })
)
app.use(router)

app.use(notFoundHandler)
app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// Експорт для тестів
export { server, app };
