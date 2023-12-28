const authMiddleware = (req, res, next) => {
    try {
        // Check if the user is authenticated (you might need to customize this based on your session structure)
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // User is authenticated, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error({ message: 'Error in authMiddleware:' }, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default authMiddleware;
