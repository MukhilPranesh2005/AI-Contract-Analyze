import React from "react";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0b1437",
                    color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            border: "3px solid rgba(201,168,76,0.3)",
                            borderTopColor: "#f0c150",
                            borderRadius: "50%",
                            margin: "0 auto 16px",
                            animation: "lt-spin-slow 1s linear infinite",
                        }}
                    />
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#f0c150" }}>Verifying Legal Session...</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>Securing connection to LexiTwin engine</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return children;
}
