import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Check if the JWT token is present in the cookie
    console.log("Coookie Data", req.cookies)
    const token = req.cookies.token;

    // If the token is not present, return unauthorized
    if (!token) {
        return res.status(401).json({ error: "Access Denied. Please log in." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the user's ID to the request object for further processing in subsequent middleware or routes
        req.uuid = decoded.uuid
        req.email = decoded.email
        req.name = decoded.name
        req.group = decoded.group
        // Call next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid, return unauthorized
        return res.status(401).json({ error: "Invalid Token. Please log in again." });
    }
};

export default authMiddleware;
