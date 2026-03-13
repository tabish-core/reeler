"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true) }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed. Please try again.");
            }

            router.push("/login");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="auth-brand-name">Reeler.</span>
                    {mounted && (
                        <button
                            type="button"
                            className="theme-switch"
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        >
                            {resolvedTheme === "dark" ? "Dark" : "Light"}
                            <div className="theme-switch-track">
                                <div className="theme-switch-thumb"></div>
                            </div>
                        </button>
                    )}
                </div>

                {/* Heading */}
                <h1 className="auth-title">Create your account</h1>
                <br />
                {/* Error */}
                {error && (
                    <div className="form-error" role="alert">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tabish@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        id="register-submit"
                    >
                        {loading ? (
                            <span className="btn-spinner">Creating account</span>
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;