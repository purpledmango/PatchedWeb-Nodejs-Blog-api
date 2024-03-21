import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access Denied" })

    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = decoded.uid
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" })
    }
}