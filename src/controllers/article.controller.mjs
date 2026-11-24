import { articles } from '../models/article.model.mjs'


export const getArticles = ('/', (req, res) => {
    const result = Array.from(articles.entries()).map(([id, data]) => ({
        id,
        ...data,
    }))
    res.status(200).json(result)
})

export const createArticle = (req, res) => {
    const { title } = req.body || {}

    const id = Date.now().toString()
    const trimmedTitle = title.trim()
    articles.set(id, {'title': trimmedTitle})

    res.status(201).send(`Article created: ${id} - ${trimmedTitle}`)
}

export const getArticleById = (req, res) => {
    const { articleId } = req.params

    if (!articles.has(articleId)) {
        return res.status(404).send('Not Found')
    }
    const article = articles.get(articleId)
    res.status(200).send(`User ${articleId}: ${article.name}`)
}

export const updateArticle = (req, res) => {
    const { articleId } = req.params
    const { title } = req.body || {}

    if (!articles.has(articleId)) {
        return res.status(404).send('Not Found')
    }

    const trimmedTitle = title.trim()
    articles.set(articleId, {'title': trimmedTitle})

    res.status(200).send(`Article updated: ${articleId} - ${trimmedTitle}`)
}

export const deleteArticle = (req, res) => {
    const { articleId } = req.params

    if (!articles.has(articleId)) {
        return res.status(404).send('Not Found')
    }

    articles.delete(articleId)
    res.status(204).send()
}