import { Router } from 'express';
import {
    getArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
} from '../controllers/article.controller.mjs'
import { checkArticlePermissions } from '../middlewares/permissions.middleware.mjs';
import { validateArticleData } from '../middlewares/validation.middleware.mjs';

const router = new Router()

router.use(checkArticlePermissions)

router.get('/', getArticles)
router.post('/', validateArticleData, createArticle)
router.get('/:articleId', getArticleById)
router.put('/:articleId', validateArticleData, updateArticle)
router.delete('/:articleId', deleteArticle)

export default router