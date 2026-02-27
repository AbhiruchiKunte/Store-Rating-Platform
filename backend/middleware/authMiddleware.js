const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = decoded; // Contains id and role
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin role required." });
    }
};

exports.isNormalUser = (req, res, next) => {
    if (req.user && req.user.role === "user") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. User role required." });
    }
};

exports.isStoreOwner = (req, res, next) => {
    if (req.user && req.user.role === "store_owner") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Store Owner role required." });
    }
};