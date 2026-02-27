const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 16 &&
        /[A-Z]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if (!name || name.length < 20 || name.length > 60)
            return res.status(400).json({ message: "Name must be 20-60 characters" });
        if (!email || !validateEmail(email))
            return res.status(400).json({ message: "Invalid email format" });
        if (!password || !validatePassword(password))
            return res.status(400).json({ message: "Password must be 8-16 characters, 1 uppercase, 1 special character" });
        if (address && address.length > 400)
            return res.status(400).json({ message: "Address max 400 characters" });

        let assignedRole = "user";
        if (role === "store_owner") {
            assignedRole = "store_owner";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.execute(sql, [name, email, hashedPassword, address || null, assignedRole]);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (results.length === 0)
            return res.status(400).json({ message: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role, name: user.name, id: user.id });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // From verifyToken middleware

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Must provide current and new password" });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: "New password must be 8-16 characters, 1 uppercase, 1 special character" });
        }

        const [results] = await db.execute("SELECT password FROM users WHERE id = ?", [userId]);
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};