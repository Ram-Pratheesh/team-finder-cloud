import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.endsWith("rajalakshmi.edu.in")) {
      errs.email = "Use your college email (@rajalakshmi.edu.in)";
    }
    if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const v = validate();
  setErrors(v);
  if (Object.keys(v).length) return;

  try {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    alert("Signup successful!");
    navigate("/login");
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong. Try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0D0D0D]">
      <div className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-2xl shadow-xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center">
          Welcome to
          <br />
          <span className="text-purple-400 font-extrabold tracking-wide">
            SIH-Team Finder 🚀
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">College Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="yourid@rajalakshmi.edu.in"
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Set your own password"
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-black font-bold py-3 rounded-xl shadow-lg transition"
          >
            Create Account
          </button>

          {/* Log in link */}
          <p className="text-center text-sm text-gray-400 mt-3">
            Already have an account?{" "}
            <span
              className="text-purple-400 underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
