export const checkArticlePermissions = (req, res, next) => {
    if (req.method === 'GET') return next()

    const role = req.session?.role || req.headers['x-user-role']

    if (role !== 'admin' && role !== 'editor') {
        return res.status(403).send('Forbidden: You do not have permission to modify articles.')
    }

    next()
}