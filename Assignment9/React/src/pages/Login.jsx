import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
        const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message || "Login failed.");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
    } catch (error) {
        setMessage(error.message || "Unable to connect to the server.");
    } finally {
        setLoading(false);
    }
    }
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1C1C1C] p-8">
                <Link to="/" className="text-sm text-[#f47735]">
                    ← Back to home
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    Welcome back
                </h1>

                <p className="mt-2 text-gray-400">
                    Login to your Hostel PG Tracker account.
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Email address
                        </label>
                        <input
                            required
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#f47735]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#f47735]"
                        />
                    </div>
                    {message && (
                        <p role="status" className="text-sm text-red-400">
                            {message}
                        </p>
                    )}
                   <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#f47735] py-3 font-semibold text-black transition hover:bg-orange-400 disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-[#f47735]">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
