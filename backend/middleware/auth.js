import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ success: false, message: "Not Authorized login Again" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("JWT_SECRET in use:", process.env.JWT_SECRET); 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Fixed variable name
        req.userId = decoded.id; // ✅ Use 'decoded', not 'token_decode'
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        res.json({ success: false, message: "Invalid or expired token" });
    }
};

export default authMiddleware;
