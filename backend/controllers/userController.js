const db = require("../config/db");

exports.getStores = async (req, res) => {
    try {
        const { sortBy = "name", order = "asc", search = "" } = req.query;
        let query = `
            SELECT s.id, s.name, s.address, s.owner_id,
            COALESCE(AVG(r.rating), 0) as overall_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (search) {
            query += " AND (s.name LIKE ? OR s.address LIKE ?)";
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        query += " GROUP BY s.id";

        const allowedSort = ["name", "address", "overall_rating"];
        const orderDir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        if (allowedSort.includes(sortBy)) {
            query += ` ORDER BY ${sortBy === 'overall_rating' ? 'AVG(r.rating)' : sortBy} ${orderDir}`;
        }

        const [stores] = await db.query(query, queryParams);

        // Fetch user's own rating for each store if logged in as user
        const userId = req.user.id;
        for (let store of stores) {
            store.overall_rating = parseFloat(store.overall_rating).toFixed(1);
            const [myRating] = await db.query("SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?", [userId, store.id]);
            store.my_rating = myRating.length > 0 ? myRating[0].rating : null;
        }

        res.json(stores);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const userId = req.user.id;

        if (!store_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Store ID and a valid rating (1-5) are required" });
        }

        // Check if rating already exists
        const [existing] = await db.query("SELECT * FROM ratings WHERE user_id = ? AND store_id = ?", [userId, store_id]);

        if (existing.length > 0) {
            return res.status(400).json({ message: "Rating already exists. Use modify endpoint instead." });
        }

        await db.query("INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)", [userId, store_id, rating]);
        res.status(201).json({ message: "Rating submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.modifyRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const userId = req.user.id;

        if (!store_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Store ID and a valid rating (1-5) are required" });
        }

        const [result] = await db.query("UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?", [rating, userId, store_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Rating not found to modify" });
        }

        res.json({ message: "Rating modified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
