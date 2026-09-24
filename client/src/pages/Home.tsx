import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { startLogin } from "@/const";
import { canContinueWithInterests, filterInterests, toggleInterestSelection } from "@/lib/trendx";

type Mode = "login" | "signup" | "interests" | "dashboard";
type Category = "All" | "Education" | "Technology" | "Career" | "Lifestyle";
type Interest = { label: string; category: Exclude<Category, "All"> };

const interests: Interest[] = [
  { label: "Sports", category: "Lifestyle" }, { label: "Technology", category: "Technology" },
  { label: "Artificial Intelligence", category: "Technology" }, { label: "Coding", category: "Technology" },
  { label: "Cybersecurity", category: "Technology" }, { label: "Startups", category: "Career" },
  { label: "Business", category: "Career" }, { label: "Finance", category: "Career" },
  { label: "Career Development", category: "Career" }, { label: "Competitive Exams", category: "Education" },
  { label: "UPSC", category: "Education" }, { label: "JEE", category: "Education" },
  { label: "NEET", category: "Education" }, { label: "Science", category: "Education" },
  { label: "Health", category: "Lifestyle" }, { label: "Entertainment", category: "Lifestyle" },
  { label: "Music", category: "Lifestyle" }, { label: "Travel", category: "Lifestyle" },
  { label: "Books", category: "Lifestyle" }, { label: "News", category: "Lifestyle" },
];

function Logo() {
  return <div className="simple-logo"><span>↗</span> TrendX</div>;
}

function AuthPage({ mode, setMode }: { mode: "login" | "signup"; setMode: (mode: Mode) => void }) {
  const signup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password.trim() || (signup && !name.trim())) {
      setError("Please fill in all required fields."); return;
    }
    if (signup && password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (signup && password !== confirm) {
      setError("Passwords do not match."); return;
    }
    if (signup && !accepted) {
      setError("Please accept the terms to continue."); return;
    }
    if (signup) {
      window.localStorage.setItem("trendx-profile", name);
      toast.success("Account created successfully.");
      setMode("interests");
    } else {
      toast.success("Signed in successfully.");
      setMode("dashboard");
    }
  };

  return <div className="simple-page"><header className="simple-header"><Logo /><span className="header-help">Personalized trends, made simple</span></header><main className="auth-main"><section className="simple-intro"><span className="simple-label">WELCOME TO TRENDX</span><h1>Discover what<br /><strong>matters to you.</strong></h1><p>Choose your interests and get a simple, personalized feed of trends, ideas, and opportunities.</p><div className="intro-list"><span>✓ Personalized updates</span><span>✓ Topics you care about</span><span>✓ One simple place to explore</span></div></section><section className="simple-card"><div className="card-heading"><h2>{signup ? "Create an account" : "Welcome back"}</h2><p>{signup ? "Start building your personalized feed." : "Sign in to continue to TrendX."}</p></div><div className="simple-tabs"><button className={!signup ? "active" : ""} onClick={() => setMode("login")}>Sign in</button><button className={signup ? "active" : ""} onClick={() => setMode("signup")}>Sign up</button></div><button className="google-button" onClick={() => { toast.info("Opening Google sign-in…"); startLogin(); }}><span className="google-letter">G</span> Continue with Google</button><div className="or-divider"><span>or</span></div><form onSubmit={submit}>{signup && <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></label>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<span className="password-input"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>{signup && <label>Confirm password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" /></label>}{signup && <label className="check-row"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /> I agree to the Terms and Privacy Policy</label>}{!signup && <button type="button" className="forgot" onClick={() => toast.info("Password recovery will be connected later.")}>Forgot password?</button>}{error && <p className="error-message">{error}</p>}<button className="primary-button" type="submit">{signup ? "Create account" : "Sign in"} <ArrowRight size={16} /></button></form><p className="secure-line"><ShieldCheck size={14} /> Your information is kept secure</p></section></main><footer className="simple-footer">© 2026 TrendX · Help · Privacy</footer></div>;
}

function InterestsPage({ setMode }: { setMode: (mode: Mode) => void }) {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(() => filterInterests(interests, category, query), [category, query]);
  const toggle = (label: string) => setSelected((current) => toggleInterestSelection(current, label));

  return <div className="simple-page"><header className="simple-header"><Logo /><button className="skip-link" onClick={() => setMode("dashboard")}>Skip for now</button></header><main className="onboarding-main"><div className="onboarding-heading"><span className="simple-label">STEP 1 OF 1</span><h1>Choose your interests</h1><p>Select at least three topics to personalize your TrendX feed.</p></div><div className="interest-controls"><div className="category-buttons">{(["All", "Education", "Technology", "Career", "Lifestyle"] as Category[]).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search interests" /></label></div><p className="selected-count">{selected.length} selected {selected.length < 3 && "· Select at least 3"}</p><div className="basic-interest-grid">{filtered.map((interest) => <button key={interest.label} className={selected.includes(interest.label) ? "selected" : ""} onClick={() => toggle(interest.label)}>{selected.includes(interest.label) ? "✓ " : "+ "}{interest.label}</button>)}</div><div className="onboarding-footer"><span>Selected interests help us show better recommendations.</span><button className="primary-button" onClick={() => { if (!canContinueWithInterests(selected)) { toast.error("Please select at least three interests."); return; } window.localStorage.setItem("trendx-interests", JSON.stringify(selected)); setMode("dashboard"); }}>Continue <ArrowRight size={16} /></button></div></main></div>;
}

function Dashboard({ setMode }: { setMode: (mode: Mode) => void }) {
  const name = window.localStorage.getItem("trendx-profile")?.split(" ")[0] || "there";
  const selected = (() => { try { return JSON.parse(window.localStorage.getItem("trendx-interests") || "[]") as string[]; } catch { return []; } })();
  const topics = selected.length ? selected : ["Technology", "Sports", "News"];
  return <div className="simple-page"><header className="simple-header"><Logo /><button className="skip-link" onClick={() => setMode("interests")}>Edit interests</button></header><main className="dashboard-simple"><span className="simple-label">YOUR TRENDX FEED</span><h1>Hello, {name}.</h1><p className="dashboard-subtitle">Here are a few topics picked for you.</p><div className="topic-row">{topics.map((topic) => <span key={topic}>{topic}</span>)}</div><section className="basic-feed"><article><span>TECHNOLOGY</span><h2>What is trending in technology today?</h2><p>Explore the latest ideas, tools, and news from the world of technology.</p><button onClick={() => toast.info("Content feed will be connected next.")}>Read more <ArrowRight size={15} /></button></article><article><span>YOUR INTERESTS</span><h2>Keep your feed relevant</h2><p>Add or remove interests anytime to improve your recommendations.</p><button onClick={() => setMode("interests")}>Update interests <ArrowRight size={15} /></button></article></section></main></div>;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("login");
  if (mode === "interests") return <InterestsPage setMode={setMode} />;
  if (mode === "dashboard") return <Dashboard setMode={setMode} />;
  return <AuthPage mode={mode} setMode={setMode} />;
}
