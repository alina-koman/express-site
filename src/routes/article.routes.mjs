import { Router } from 'express';
import {
    getArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
} from '../controllers/article.controller.mjs'

const router = new Router()

router.get('/', getArticles)
router.post('/', createArticle)
router.get('/:articleId', getArticleById)
router.put('/:articleId', updateArticle)
router.delete('/:articleId', deleteArticle)

export default router