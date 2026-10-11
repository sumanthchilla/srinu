
import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      setMessage(data.message);
      setSuccess(data.success);

      if (data.success) {
        setFormData({
          name: "",
          email: "",
          password: ""
        });
      }
    } catch (error) {
      setMessage(
        "Cannot connect to server. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="signup-card">
        <div className="brand-icon">S</div>

        <h1>Create account</h1>
        <p className="subtitle">
          Sign up to get started with your account.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={`message ${
              success ? "success" : "error"
            }`}
            role="status"
          >
            {message}
          </p>
        )}

        <p className="footer-text">
          Already have an account?{" "}
          <span>Sign in</span>
        </p>
      </section>
    </main>
  );
}

export default App;
