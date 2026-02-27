import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation: 20-60 characters
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 20) {
      newErrors.name = "Name must be at least 20 characters";
    } else if (form.name.length > 60) {
      newErrors.name = "Name must not exceed 60 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Address validation: max 400 characters
    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    } else if (form.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters";
    }

    // Password validation: 8-16 characters, at least one uppercase and one special character
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must include at least one uppercase letter";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(form.password)) {
      newErrors.password = "Password must include at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address,
      });

      alert("Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="container">
      <h2>Create Account</h2>
      <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
        Join the Store Rating Platform
      </p>

      <form onSubmit={handleSignup}>
        {errors.general && <div className="error-message">{errors.general}</div>}

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name (20-60 characters)"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="address"
            placeholder="Address (max 400 characters)"
            value={form.address}
            onChange={handleChange}
            className={errors.address ? "input-error" : ""}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;