import React, { useEffect, useState } from "react";

function OwnerDashboard() {
  const [storeInfo] = useState({
    name: "Best Electronics Store",
    averageRating: 4.5,
  });
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("ratings");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const fetchOwnerDashboard = async () => {
    try {
      // Mock data - in real scenario would be from API
      const mockRatings = [
        {
          id: 1,
          userName: "John Anderson Smith",
          userEmail: "john@example.com",
          rating: 5,
          date: "2024-02-20",
        },
        {
          id: 2,
          userName: "Sarah Mitchell Johnson",
          userEmail: "sarah@example.com",
          rating: 4,
          date: "2024-02-19",
        },
        {
          id: 3,
          userName: "Michael David Brown",
          userEmail: "michael@example.com",
          rating: 5,
          date: "2024-02-18",
        },
        {
          id: 4,
          userName: "Emily Rose Williams",
          userEmail: "emily@example.com",
          rating: 4,
          date: "2024-02-17",
        },
        {
          id: 5,
          userName: "James Christopher Lee",
          userEmail: "james@example.com",
          rating: 3,
          date: "2024-02-16",
        },
      ];

      setRatings(mockRatings);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
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
      // In real scenario: await API.post("/owner/update-password", passwordForm);
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

  const averageRating = calculateAverageRating();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Store Owner Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="store-info-section">
        <div className="store-info-card">
          <h2>{storeInfo.name}</h2>
          <div className="rating-display">
            <p>Average Rating:</p>
            <p className="big-rating">⭐ {averageRating} / 5</p>
            <p className="total-ratings">({ratings.length} ratings)</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "ratings" ? "active" : ""}`}
          onClick={() => setActiveTab("ratings")}
        >
          User Ratings
        </button>
        <button
          className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Update Password
        </button>
      </div>

      {activeTab === "ratings" && (
        <div className="tab-content">
          <div className="ratings-list">
            {ratings.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((rating) => (
                      <tr key={rating.id}>
                        <td>{rating.userName}</td>
                        <td>{rating.userEmail}</td>
                        <td className="rating-cell">
                          <span className="rating-badge">
                            ⭐ {rating.rating}
                          </span>
                        </td>
                        <td>{new Date(rating.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <p>No ratings yet. Be patient, users will start rating soon!</p>
              </div>
            )}
          </div>

          {ratings.length > 0 && (
            <div className="summary-section">
              <div className="summary-card">
                <h4>Total Ratings Received</h4>
                <p className="summary-number">{ratings.length}</p>
              </div>
              <div className="summary-card">
                <h4>Current Average</h4>
                <p className="summary-number">⭐ {averageRating}</p>
              </div>
              <div className="summary-card">
                <h4>Highest Rating</h4>
                <p className="summary-number">
                  ⭐ {Math.max(...ratings.map((r) => r.rating))}
                </p>
              </div>
              <div className="summary-card">
                <h4>Lowest Rating</h4>
                <p className="summary-number">
                  ⭐ {Math.min(...ratings.map((r) => r.rating))}
                </p>
              </div>
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

export default OwnerDashboard;