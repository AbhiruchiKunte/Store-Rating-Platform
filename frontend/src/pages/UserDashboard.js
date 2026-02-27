import React, { useEffect, useState, useCallback } from "react";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("stores");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStores();
    loadUserRatings();
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim() === "") {
      setFilteredStores(stores);
      return;
    }

    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, stores, handleSearch]);

  const fetchStores = async () => {
    try {
      // Mock data - in real scenario would be from API
      const mockStores = [
        {
          id: 1,
          name: "Best Electronics Store",
          address: "123 Main Street",
          avgRating: 4.5,
        },
        {
          id: 2,
          name: "Quality Grocery Market",
          address: "456 Oak Avenue",
          avgRating: 4.2,
        },
        {
          id: 3,
          name: "Fashion Hub Downtown",
          address: "789 Fashion Street",
          avgRating: 4.8,
        },
        {
          id: 4,
          name: "Book Corner Store",
          address: "321 Library Lane",
          avgRating: 4.0,
        },
        {
          id: 5,
          name: "Sports Equipment Center",
          address: "654 Athletic Park",
          avgRating: 4.6,
        },
      ];

      setStores(mockStores);
      setFilteredStores(mockStores);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    }
  };

  const loadUserRatings = () => {
    // Load user's ratings from localStorage (mock data)
    const savedRatings = localStorage.getItem("userRatings");
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
  };



  const submitRating = (storeId, rating) => {
    setUserRatings({
      ...userRatings,
      [storeId]: rating,
    });
    localStorage.setItem(
      "userRatings",
      JSON.stringify({
        ...userRatings,
        [storeId]: rating,
      })
    );
    setMessage(`Rating ${rating} submitted for store ${storeId}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (
      passwordForm.newPassword.length < 8 ||
      passwordForm.newPassword.length > 16
    ) {
      newErrors.newPassword = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
      newErrors.newPassword =
        "Password must include at least one uppercase letter";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(passwordForm.newPassword)) {
      newErrors.newPassword =
        "Password must include at least one special character";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);

    try {
      // In real scenario: await API.post("/user/update-password", passwordForm);
      // For now, just mock the update
      setMessage("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setPasswordErrors({
        general: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "stores" ? "active" : ""}`}
          onClick={() => setActiveTab("stores")}
        >
          Stores & Ratings
        </button>
        <button
          className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Update Password
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {activeTab === "stores" && (
        <div className="tab-content">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="stores-grid">
            {filteredStores.map((store) => (
              <div key={store.id} className="store-card">
                <h3>{store.name}</h3>
                <p className="store-address">
                  <strong>📍 Address:</strong> {store.address}
                </p>
                <p className="store-rating">
                  <strong>⭐ Average Rating:</strong>{" "}
                  {Number(store.avgRating).toFixed(1)}/5
                </p>

                {userRatings[store.id] && (
                  <p className="your-rating">
                    <strong>Your Rating:</strong> ⭐ {userRatings[store.id]}
                  </p>
                )}

                <div className="rating-buttons">
                  <p className="rating-label">Your Rating:</p>
                  <div className="button-group">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        className={`rating-btn ${
                          userRatings[store.id] === num ? "active" : ""
                        }`}
                        onClick={() => submitRating(store.id, num)}
                        title={`Rate ${num} stars`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <p>No stores found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "password" && (
        <div className="tab-content form-container">
          <h3>Update Your Password</h3>

          {passwordErrors.general && (
            <div className="error-message">{passwordErrors.general}</div>
          )}

          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>Current Password *</label>
              <input
                type="password"
                placeholder="Enter your current password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className={
                  passwordErrors.currentPassword ? "input-error" : ""
                }
              />
              {passwordErrors.currentPassword && (
                <span className="field-error">
                  {passwordErrors.currentPassword}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>New Password (8-16 chars, 1 uppercase, 1 special char) *</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className={passwordErrors.newPassword ? "input-error" : ""}
              />
              {passwordErrors.newPassword && (
                <span className="field-error">
                  {passwordErrors.newPassword}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className={
                  passwordErrors.confirmPassword ? "input-error" : ""
                }
              />
              {passwordErrors.confirmPassword && (
                <span className="field-error">
                  {passwordErrors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="submit-btn"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;