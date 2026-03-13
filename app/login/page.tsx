"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const LoginPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true) }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid email or password. Please try again.");
        } else {
            router.push("/");
            router.refresh();
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
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to your account to continue</p>

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
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        id="login-submit"
                    >
                        {loading ? (
                            <span className="btn-spinner">Signing in</span>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="auth-footer">
                    Don&apos;t have an account?{" "}
                    <Link href="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;