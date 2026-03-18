import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./config";
const ProfileSetUp = () => {
  const navigate = useNavigate();

  const [techStacks, setTechStacks] = useState([]);
  const [inputStack, setInputStack] = useState("");
  const [rolesSelected, setRolesSelected] = useState([]);
  const [otherRole, setOtherRole] = useState("");
  
  // Controlled inputs for text fields
  const [name, setName] = useState("");
  const [collegeMail, setCollegeMail] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [bio, setBio] = useState("");
  
  const [loading, setLoading] = useState(false); // loading state
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Determine year based on email
  const determineYearFromEmail = (email) => {
    if (!email) return "";
    if (email.includes("2024")) return "2nd Year";
    if (email.includes("2025")) return "1st Year";

    const rollNumberPrefix = email.substring(0, 2);
    switch (rollNumberPrefix) {
      case "22":
        return "4th Year";
      case "23":
        return "3rd Year";
      default:
        return "";
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      // Set email from session storage as fallback
      const savedEmail = sessionStorage.getItem("email");
      if (savedEmail) {
        setCollegeMail(savedEmail);
        setSelectedYear(determineYearFromEmail(savedEmail));
      }

      // Fetch existing profile if it exists
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/profile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          if (profileData && profileData._id) {
            setName(profileData.name || "");
            if (profileData.collegeMail) setCollegeMail(profileData.collegeMail);
            if (profileData.year) setSelectedYear(profileData.year);
            setTechStacks(profileData.techStacks || []);
            
            // Handle roles and 'Other' role filtering
            if (profileData.roles) {
              const standardRoles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Designer", "Machine Learning Engineer", "AI Engineer", "Cyber Security Engineer"];
              const userStandardRoles = profileData.roles.filter(r => standardRoles.includes(r));
              const customRoles = profileData.roles.filter(r => !standardRoles.includes(r));
              
              if (customRoles.length > 0) {
                userStandardRoles.push("Other");
                setOtherRole(customRoles[0]);
              }
              setRolesSelected(userStandardRoles);
            }

            setLinkedin(profileData.linkedin || "");
            setGithub(profileData.github || "");
            setBio(profileData.bio || "");
          }
        }
      } catch (err) {
        console.error("Failed to load existing profile", err);
      } finally {
        setFetchingProfile(false);
      }
    };

    loadProfileData();
  }, []);

  const availableStacks = [
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Angular",
    "Vue.js", "Svelte", "TailwindCSS", "Bootstrap", "Material-UI", "Node.js",
    "Express.js", "Django", "Flask", "Spring Boot", "Ruby on Rails", "Laravel",
    "ASP.NET Core", "FastAPI", "NestJS", "React Native", "Flutter", "Ionic",
    "Kotlin", "Swift", "Java (Android)", "MongoDB", "MySQL", "PostgreSQL",
    "SQLite", "Redis", "Firebase", "Supabase", "OracleDB", "Docker", "Kubernetes",
    "AWS", "Azure", "Google Cloud", "Heroku", "Netlify", "Vercel", "CI/CD",
    "GitHub Actions", "C", "C++", "C#", "Java", "Python", "Go", "Rust", "PHP",
    "Ruby", "Scala", "R", "TensorFlow", "PyTorch", "Keras", "OpenCV", "Scikit-learn",
    "Pandas", "NumPy", "LangChain", "Hugging Face Transformers", "Kali Linux",
    "Metasploit", "Burp Suite", "Wireshark", "Nmap", "GraphQL", "REST API",
    "WebSockets", "Blockchain", "Solidity", "Hardhat", "Truffle"
  ];

  const roles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Designer",
    "Machine Learning Engineer", "AI Engineer", "Cyber Security Engineer", "Other"
  ];

  const handleAddStack = (stack) => {
    if (stack && !techStacks.includes(stack)) setTechStacks([...techStacks, stack]);
    setInputStack("");
  };

  const handleRemoveStack = (stack) => {
    setTechStacks(techStacks.filter((s) => s !== stack));
  };

  const toggleRole = (role) => {
    if (rolesSelected.includes(role)) {
      setRolesSelected(rolesSelected.filter((r) => r !== role));
    } else {
      setRolesSelected([...rolesSelected, role]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return; 
  setLoading(true);

  const profileData = {
    name: e.target.name.value,
    year: selectedYear || e.target.year.value,
    collegeMail: collegeMail || e.target.collegeMail.value,
    techStacks,
    roles: rolesSelected.includes("Other")
      ? [...rolesSelected.filter((r) => r !== "Other"), otherRole]
      : rolesSelected,
    linkedin: e.target.linkedin.value,
    github: e.target.github.value || "",
    bio: e.target.bio.value || "",
  };

  try {
    const token = sessionStorage.getItem("token"); // ✅ get token
    console.log("Token at ProfileSetUp:", token);

    const response = await fetch(`${API_URL}/profile/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ attach JWT
      },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Profile created successfully:", data);
      alert("Profile created successfully!");
      navigate("/dashboard");
    } else {
      const err = await response.json();
      console.error("❌ Failed to create profile:", err);
      alert(err.message || "Failed to create profile");
    }
  } catch (error) {
    console.error("⚠ Error creating profile:", error);
    console.error("Error creating profile");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0B]">
      <div className="w-full max-w-3xl bg-[#141414] p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
          Complete Your Profile
        </h1>
        <h2 className="text-lg text-gray-300 text-center mb-6">
          Let others know more about you
        </h2>

        {fetchingProfile ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Year */}
          <div>
            <label className="text-sm text-gray-400">
              Year {selectedYear && <span className="text-green-400">(Auto-detected)</span>}
            </label>
            <input
              type="text"
              name="year"
              required
              value={selectedYear}
              readOnly
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* College Mail */}
          <div>
            <label className="text-sm text-gray-400">College Mail ID</label>
            <input
              type="email"
              name="collegeMail"
              required
              value={collegeMail}
              readOnly
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Tech Stacks */}
          <div>
            <label className="text-sm text-gray-400">Tech Stacks</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStacks.map((stack) => (
                <span
                  key={stack}
                  className="px-3 py-1 bg-purple-700 text-white rounded-full text-sm flex items-center gap-1"
                >
                  {stack}
                  <button
                    type="button"
                    className="text-red-400 font-bold"
                    onClick={() => handleRemoveStack(stack)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputStack}
                onChange={(e) => setInputStack(e.target.value)}
                placeholder="Type or select a tech stack..."
                className="flex-1 p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (inputStack.trim()) handleAddStack(inputStack.trim());
                  }
                }}
                list="tech-options"
              />
              <button
                type="button"
                onClick={() => handleAddStack(inputStack)}
                className="px-4 bg-purple-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
            <datalist id="tech-options">
              {availableStacks.map((stack) => (
                <option key={stack} value={stack} />
              ))}
            </datalist>
          </div>

          {/* Roles */}
          <div>
            <label className="text-sm text-gray-400">Preferred Roles</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    rolesSelected.includes(r)
                      ? "bg-purple-500 text-white"
                      : "bg-[#0F0F0F] text-gray-300 border-gray-700"
                  }`}
                  onClick={() => toggleRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            {rolesSelected.includes("Other") && (
              <input
                type="text"
                placeholder="Enter your role"
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                className="w-full mt-2 p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="text-sm text-gray-400">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              required
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* GitHub (Optional) */}
          <div>
            <label className="text-sm text-gray-400">GitHub Profile (Optional)</label>
            <input
              type="url"
              name="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Bio (Optional) */}
          <div>
            <label className="text-sm text-gray-400">Short Bio (Optional)</label>
            <textarea
              name="bio"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-black font-bold py-3 rounded-xl shadow-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSetUp;