const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.getDashboardStats = async (req, res) => {
    try {
        const [users] = await db.query("SELECT COUNT(*) as total FROM users");
        const [stores] = await db.query("SELECT COUNT(*) as total FROM stores");
        const [ratings] = await db.query("SELECT COUNT(*) as total FROM ratings");

        res.json({
            usersCount: users[0].total,
            storesCount: stores[0].total,
            ratingsCount: ratings[0].total
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        // Basic check for admin creating users
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields except address are required" });
        }
        if (role !== "admin" && role !== "user") {
            return res.status(400).json({ message: "Role must be admin or user" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query("INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)", [name, email, hashedPassword, address || null, role]);

        res.status(201).json({ message: "User added successfully", userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Email already exists" });
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Verify owner_id exists and is a store_owner (or make them one)
        const [users] = await db.query("SELECT * FROM users WHERE id = ?", [owner_id]);
        if (users.length === 0) return res.status(400).json({ message: "Owner not found" });

        if (users[0].role !== "store_owner") {
            await db.query("UPDATE users SET role = 'store_owner' WHERE id = ?", [owner_id]);
        }

        const [result] = await db.query("INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)", [name, email, address, owner_id]);
        res.status(201).json({ message: "Store added successfully", storeId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { sortBy = "name", order = "asc", name, email, address, role } = req.query;
        let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
        const queryParams = [];

        if (name) { query += " AND name LIKE ?"; queryParams.push(`%${name}%`); }
        if (email) { query += " AND email LIKE ?"; queryParams.push(`%${email}%`); }
        if (address) { query += " AND address LIKE ?"; queryParams.push(`%${address}%`); }
        if (role) { query += " AND role = ?"; queryParams.push(role); }

        const allowedSort = ["name", "email", "address", "role"];
        const orderDir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        if (allowedSort.includes(sortBy)) {
            query += ` ORDER BY ${sortBy} ${orderDir}`;
        }

        const [users] = await db.query(query, queryParams);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getStores = async (req, res) => {
    try {
        const { sortBy = "name", order = "asc", name, email, address } = req.query;
        let query = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id,
            COALESCE(AVG(r.rating), 0) as overall_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (name) { query += " AND s.name LIKE ?"; queryParams.push(`%${name}%`); }
        if (email) { query += " AND s.email LIKE ?"; queryParams.push(`%${email}%`); }
        if (address) { query += " AND s.address LIKE ?"; queryParams.push(`%${address}%`); }

        query += " GROUP BY s.id";

        const allowedSort = ["name", "email", "address", "overall_rating"];
        const orderDir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        if (allowedSort.includes(sortBy)) {
            query += ` ORDER BY ${sortBy} ${orderDir}`;
        }

        const [stores] = await db.query(query, queryParams);
        // Cast overall_rating to float
        stores.forEach(s => s.overall_rating = parseFloat(s.overall_rating).toFixed(1));

        res.json(stores);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await db.query("SELECT id, name, email, address, role FROM users WHERE id = ?", [id]);

        if (users.length === 0) return res.status(404).json({ message: "User not found" });
        const user = users[0];

        if (user.role === "store_owner") {
            const [stores] = await db.query(`
                SELECT s.name, COALESCE(AVG(r.rating), 0) as rating
                FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.owner_id = ? GROUP BY s.id
            `, [id]);
            user.stores = stores.map(st => ({ name: st.name, rating: parseFloat(st.rating).toFixed(1) }));
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
