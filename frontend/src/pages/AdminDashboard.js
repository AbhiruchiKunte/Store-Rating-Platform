import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    storeSearch: "",
    storeSort: "name",
    userSearch: "",
    userSort: "name",
    userRole: "all",
  });
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Since backend endpoints are placeholders, we'll create mock data
      // In real scenario, these would be actual API calls
      setStats({
        totalUsers: 25,
        totalStores: 12,
        totalRatings: 150,
      });

      // Mock data for stores
      const mockStores = [
        {
          id: 1,
          name: "Best Electronics Store",
          email: "store@example.com",
          address: "123 Main Street",
          rating: 4.5,
        },
        {
          id: 2,
          name: "Quality Grocery Market",
          email: "grocery@example.com",
          address: "456 Oak Avenue",
          rating: 4.2,
        },
        {
          id: 3,
          name: "Fashion Hub Downtown",
          email: "fashion@example.com",
          address: "789 Fashion Street",
          rating: 4.8,
        },
      ];

      const mockUsers = [
        {
          id: 1,
          name: "John Anderson Smith",
          email: "john@example.com",
          address: "123 Main Street",
          role: "user",
        },
        {
          id: 2,
          name: "Sarah Mitchell Johnson",
          email: "sarah@example.com",
          address: "456 Oak Avenue",
          role: "user",
        },
        {
          id: 3,
          name: "Premium Store Owner",
          email: "owner@example.com",
          address: "789 Fashion Street",
          role: "store_owner",
          rating: 4.8,
        },
        {
          id: 4,
          name: "Admin User Account Name",
          email: "admin@example.com",
          address: "999 Admin Plaza",
          role: "admin",
        },
      ];

      setStores(mockStores);
      setFilteredStores(mockStores);
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleStoreFilter = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyStoreFilters(updatedFilters);
  };

  const handleUserFilter = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyUserFilters(updatedFilters);
  };

  const applyStoreFilters = (updatedFilters) => {
    let filtered = stores.filter((store) =>
      store.name
        .toLowerCase()
        .includes(updatedFilters.storeSearch.toLowerCase()) ||
      store.email.toLowerCase().includes(updatedFilters.storeSearch.toLowerCase()) ||
      store.address
        .toLowerCase()
        .includes(updatedFilters.storeSearch.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      if (updatedFilters.storeSort === "name") {
        return a.name.localeCompare(b.name);
      } else if (updatedFilters.storeSort === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

    setFilteredStores(filtered);
  };

  const applyUserFilters = (updatedFilters) => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(updatedFilters.userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(updatedFilters.userSearch.toLowerCase()) ||
        user.address
          .toLowerCase()
          .includes(updatedFilters.userSearch.toLowerCase());

      const matchesRole =
        updatedFilters.userRole === "all" || user.role === updatedFilters.userRole;

      return matchesSearch && matchesRole;
    });

    // Sort
    filtered.sort((a, b) => {
      if (updatedFilters.userSort === "name") {
        return a.name.localeCompare(b.name);
      } else if (updatedFilters.userSort === "email") {
        return a.email.localeCompare(b.email);
      }
      return 0;
    });

    setFilteredUsers(filtered);
  };

  const validateStoreForm = () => {
    const newErrors = {};

    if (!newStore.name.trim()) {
      newErrors.storeName = "Store name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newStore.email.trim()) {
      newErrors.storeEmail = "Email is required";
    } else if (!emailRegex.test(newStore.email)) {
      newErrors.storeEmail = "Please enter a valid email";
    }

    if (!newStore.address.trim()) {
      newErrors.storeAddress = "Address is required";
    } else if (newStore.address.length > 400) {
      newErrors.storeAddress = "Address must not exceed 400 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUserForm = () => {
    const newErrors = {};

    if (!newUser.name.trim()) {
      newErrors.userName = "Name is required";
    } else if (newUser.name.length < 20) {
      newErrors.userName = "Name must be at least 20 characters";
    } else if (newUser.name.length > 60) {
      newErrors.userName = "Name must not exceed 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(newUser.email)) {
      newErrors.userEmail = "Please enter a valid email";
    }

    if (!newUser.address.trim()) {
      newErrors.userAddress = "Address is required";
    } else if (newUser.address.length > 400) {
      newErrors.userAddress = "Address must not exceed 400 characters";
    }

    if (!newUser.password) {
      newErrors.userPassword = "Password is required";
    } else if (newUser.password.length < 8 || newUser.password.length > 16) {
      newErrors.userPassword = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(newUser.password)) {
      newErrors.userPassword = "Password must include at least one uppercase letter";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(newUser.password)) {
      newErrors.userPassword = "Password must include at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStore = async (e) => {
    e.preventDefault();

    if (!validateStoreForm()) {
      return;
    }

    setLoading(true);

    try {
      // In real scenario: await API.post("/admin/store", newStore);
      const newStoreData = {
        id: Math.max(...stores.map((s) => s.id), 0) + 1,
        ...newStore,
        rating: 0,
      };
      setStores([...stores, newStoreData]);
      setFilteredStores([...stores, newStoreData]);
      setNewStore({ name: "", email: "", address: "" });
      setErrors({});
      alert("Store added successfully!");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Failed to add store",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!validateUserForm()) {
      return;
    }

    setLoading(true);

    try {
      // In real scenario: await API.post("/admin/user", newUser);
      const newUserData = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...newUser,
      };
      setUsers([...users, newUserData]);
      applyUserFilters(filters);
      setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
      setErrors({});
      alert("User added successfully!");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Failed to add user",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === "stores" ? "active" : ""}`}
          onClick={() => setActiveTab("stores")}
        >
          Stores
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === "addStore" ? "active" : ""}`}
          onClick={() => setActiveTab("addStore")}
        >
          Add Store
        </button>
        <button
          className={`tab-btn ${activeTab === "addUser" ? "active" : ""}`}
          onClick={() => setActiveTab("addUser")}
        >
          Add User
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Stores</h3>
              <p className="stat-number">{stats.totalStores}</p>
            </div>
            <div className="stat-card">
              <h3>Total Ratings</h3>
              <p className="stat-number">{stats.totalRatings}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stores" && (
        <div className="tab-content">
          <div className="filter-section">
            <input
              type="text"
              placeholder="Search stores by name, email, or address"
              name="storeSearch"
              value={filters.storeSearch}
              onChange={handleStoreFilter}
              className="filter-input"
            />
            <select
              name="storeSort"
              value={filters.storeSort}
              onChange={handleStoreFilter}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>⭐ {Number(store.rating).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStores.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No stores found
            </p>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="tab-content">
          <div className="filter-section">
            <input
              type="text"
              placeholder="Search users by name, email, or address"
              name="userSearch"
              value={filters.userSearch}
              onChange={handleUserFilter}
              className="filter-input"
            />
            <select
              name="userRole"
              value={filters.userRole}
              onChange={handleUserFilter}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
            <select
              name="userSort"
              value={filters.userSort}
              onChange={handleUserFilter}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  {filteredUsers.some((u) => u.role === "store_owner") && (
                    <th>Rating</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === "user"
                          ? "Normal User"
                          : user.role === "store_owner"
                          ? "Store Owner"
                          : "Admin"}
                      </span>
                    </td>
                    {user.rating && <td>⭐ {Number(user.rating).toFixed(1)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No users found
            </p>
          )}
        </div>
      )}

      {activeTab === "addStore" && (
        <div className="tab-content form-container">
          <h3>Add New Store</h3>
          {errors.general && <div className="error-message">{errors.general}</div>}

          <form onSubmit={handleAddStore}>
            <div className="form-group">
              <label>Store Name *</label>
              <input
                type="text"
                placeholder="Enter store name"
                value={newStore.name}
                onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                className={errors.storeName ? "input-error" : ""}
              />
              {errors.storeName && (
                <span className="field-error">{errors.storeName}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter store email"
                value={newStore.email}
                onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                className={errors.storeEmail ? "input-error" : ""}
              />
              {errors.storeEmail && (
                <span className="field-error">{errors.storeEmail}</span>
              )}
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                placeholder="Enter store address (max 400 characters)"
                value={newStore.address}
                onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                maxLength="400"
                className={errors.storeAddress ? "input-error" : ""}
              />
              {errors.storeAddress && (
                <span className="field-error">{errors.storeAddress}</span>
              )}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Adding..." : "Add Store"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "addUser" && (
        <div className="tab-content form-container">
          <h3>Add New User</h3>
          {errors.general && <div className="error-message">{errors.general}</div>}

          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Full Name (20-60 characters) *</label>
              <input
                type="text"
                placeholder="Enter user full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className={errors.userName ? "input-error" : ""}
              />
              {errors.userName && (
                <span className="field-error">{errors.userName}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter user email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className={errors.userEmail ? "input-error" : ""}
              />
              {errors.userEmail && (
                <span className="field-error">{errors.userEmail}</span>
              )}
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                placeholder="Enter user address (max 400 characters)"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                maxLength="400"
                className={errors.userAddress ? "input-error" : ""}
              />
              {errors.userAddress && (
                <span className="field-error">{errors.userAddress}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password (8-16 chars, 1 uppercase, 1 special char) *</label>
              <input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className={errors.userPassword ? "input-error" : ""}
              />
              {errors.userPassword && (
                <span className="field-error">{errors.userPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;