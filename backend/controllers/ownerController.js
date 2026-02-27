const db = require("../config/db");

exports.getStoreDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find owner's store
        const [stores] = await db.query("SELECT id, name FROM stores WHERE owner_id = ?", [ownerId]);

        if (stores.length === 0) {
            return res.status(404).json({ message: "No store found for this owner" });
        }

        const store = stores[0];

        // Get ratings for this store
        const [ratings] = await db.query(`
            SELECT r.rating, u.name as user_name, u.email as user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
        `, [store.id]);

        // Calculate average
        const avgRating = ratings.length > 0
            ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
            : 0;

        res.json({
            storeName: store.name,
            averageRating: avgRating,
            ratings: ratings
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
