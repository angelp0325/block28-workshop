import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  async function signup(username) {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: "super-secret-999",
        }),
      });

      if (!response.ok) throw new Error("Signup failed");

      const result = await response.json();
      if (!result.token) throw new Error("No token received");

      setToken(result.token);
      setLocation("TABLET");
    } catch (err) {
      console.error("Error during signup:", err);
    }
  }

  async function authenticate() {
    try {
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API}/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Authentication failed");

      const result = await response.json();
      if (!result.success) throw new Error("Invalid authentication response");

      setLocation("TUNNEL");
    } catch (err) {
      console.error("Error during authentication:", err);
    }
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
