import {Link, useNavigate} from "react-router-dom"
import {useState} from "react"

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSignup(e) {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(
        "http://localhost:5001/api/auth/signup",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
        }

        setMessage("Account created successfully!");

        setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
        setMessage(error.message || "Unable to connect to the server.");
    } finally {
        setLoading(false);
    }
}
    return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1C1C1C] p-8">
        <Link
          to="/"
          className="text-sm text-[#f47735] hover:text-orange-400"
        >
          ← Back to home
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Create your account
        </h1>

        <p className="mt-2 text-gray-400">
          Find your perfect student stay with Hostel PG Tracker.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Full name
            </label>
            <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#f47735]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email address
            </label>
            <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#f47735]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>
           <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#f47735]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirm password
            </label>
            <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#f47735]"
            />
          </div>
            {message && (
                <p role="status" className="text-sm text-gray-300">
                    {message}
                </p>
            )}
            <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#f47735] py-3 font-semibold text-black transition hover:bg-orange-400 disabled:opacity-60"
            >
                {loading ? "Creating account..." : "Create Account"}
            </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#f47735] hover:text-orange-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;