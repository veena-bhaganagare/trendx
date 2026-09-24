import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { startLogin } from "@/const";
import { canContinueWithInterests, filterInterests, toggleInterestSelection } from "@/lib/trendx";

type Mode = "login" | "signup" | "interests" | "dashboard";
type Category = "All" | "Trending" | "Education" | "Technology" | "Career" | "Lifestyle";
type Interest = { label: string; category: Exclude<Category, "All">; trending?: boolean };

const interests: Interest[] = [
  { label: "Artificial Intelligence", category: "Technology", trending: true },
  { label: "Technology", category: "Technology" },
  { label: "Competitive Exams", category: "Education", trending: true },
  { label: "Startups & Business", category: "Career", trending: true },
  { label: "Sports", category: "Lifestyle", trending: true },
  { label: "Health & Wellness", category: "Lifestyle", trending: true },
  { label: "Coding & Software", category: "Technology" },
  { label: "Cybersecurity", category: "Technology" },
  { label: "Finance & Investing", category: "Career", trending: true },
  { label: "Career Development", category: "Career" },
  { label: "UPSC & Government Exams", category: "Education" },
  { label: "JEE & NEET Preparation", category: "Education" },
  { label: "Science & Space", category: "Education" },
  { label: "News & Current Affairs", category: "Lifestyle", trending: true },
  { label: "Entertainment", category: "Lifestyle" },
  { label: "Gaming", category: "Lifestyle" },
  { label: "Music", category: "Lifestyle" },
  { label: "Travel", category: "Lifestyle" },
  { label: "Books & Learning", category: "Education" },
  { label: "Climate & Environment", category: "Lifestyle", trending: true },
  { label: "Design & Creativity", category: "Career" },
  { label: "Productivity", category: "Career" },
  { label: "Movies & Pop Culture", category: "Lifestyle" },
  { label: "Entrepreneurship", category: "Career" },
];

function Logo() { return <div className="simple-logo"><span>↗</span> TrendX</div>; }

function AuthPage({ mode, setMode }: { mode: "login" | "signup"; setMode: (mode: Mode) => void }) {
  const signup = mode === "signup";
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [showPassword, setShowPassword] = useState(false); const [accepted, setAccepted] = useState(false); const [error, setError] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); setError(""); if (!email.trim() || !password.trim() || (signup && !name.trim())) return setError("Please fill in all required fields."); if (signup && password.length < 8) return setError("Password must be at least 8 characters."); if (signup && password !== confirm) return setError("Passwords do not match."); if (signup && !accepted) return setError("Please accept the terms to continue."); const profileName = signup ? name.trim() : email.split("@")[0].replace(/[._-]/g, " "); window.localStorage.setItem("trendx-profile", profileName); toast.success(signup ? "Account created successfully." : "Signed in successfully."); setMode("interests"); };
  return <div className="simple-page"><header className="simple-header"><Logo /><span className="header-help">Your interests, made useful</span></header><main className="auth-main"><section className="simple-intro"><span className="simple-label">WELCOME TO TRENDX</span><h1>Turn your interests<br /><strong>into insights.</strong></h1><p>Choose the subjects that matter to you and get a clearer, more personal view of the ideas, trends, and opportunities worth your attention.</p><div className="intro-note"><Sparkles size={17} /><span><b>A smarter starting point</b><br />Tell us what you care about. TrendX will help you discover what is changing around it.</span></div></section><section className="simple-card"><div className="card-heading"><h2>{signup ? "Create your TrendX profile" : "Welcome back"}</h2><p>{signup ? "Set up your interests in less than a minute." : "Sign in to continue to your personalized space."}</p></div><p className="account-switch">{signup ? "Already have an account?" : "New to TrendX?"} <button onClick={() => setMode(signup ? "login" : "signup")}>{signup ? "Sign in" : "Sign up"}</button></p><button className="google-button" onClick={() => { toast.info("Opening Google sign-in…"); startLogin(); }}><span className="google-letter">G</span> Continue with Google</button><div className="or-divider"><span>or</span></div><form onSubmit={submit}>{signup && <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></label>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<span className="password-input"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>{signup && <label>Confirm password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" /></label>}{signup && <label className="check-row"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /> I agree to the Terms and Privacy Policy</label>}{!signup && <button type="button" className="forgot" onClick={() => toast.info("Password recovery will be connected later.")}>Forgot password?</button>}{error && <p className="error-message">{error}</p>}<button className="primary-button" type="submit">{signup ? "Create my profile" : "Sign in"} <ArrowRight size={16} /></button></form><p className="secure-line"><ShieldCheck size={14} /> Your information is kept secure</p></section></main><footer className="simple-footer">© 2026 TrendX · Help · Privacy</footer></div>;
}

function InterestsPage({ setMode }: { setMode: (mode: Mode) => void }) {
  const [category, setCategory] = useState<Category>("All"); const [query, setQuery] = useState(""); const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(() => filterInterests(interests, category, query), [category, query]);
  const toggle = (label: string) => setSelected((current) => toggleInterestSelection(current, label));
  return <div className="simple-page"><header className="simple-header"><Logo /><span className="setup-step">STEP 1 OF 1 · INTERESTS</span><button className="skip-link" onClick={() => setMode("dashboard")}>Skip for now</button></header><main className="onboarding-main"><div className="onboarding-heading"><span className="simple-label">BUILD YOUR SIGNAL</span><h1>What are you curious about?</h1><p>Pick the topics you want to follow. Choose at least three and we will shape your TrendX feed around them.</p></div><div className="interest-controls"><div className="category-buttons">{(["All", "Trending", "Education", "Technology", "Career", "Lifestyle"] as Category[]).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item === "Trending" && <TrendingUp size={13} />} {item}</button>)}</div><label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search interests" /></label></div><div className="interest-status"><p className="selected-count"><b>{selected.length}</b> selected {selected.length < 3 && "· Choose at least 3"}</p><span>Select the subjects you want to see more clearly.</span></div><div className="basic-interest-grid">{filtered.map((interest) => <button key={interest.label} className={selected.includes(interest.label) ? "selected" : ""} onClick={() => toggle(interest.label)}><span>{selected.includes(interest.label) ? "✓" : "+"}</span>{interest.label}{interest.trending && <em>Trending</em>}</button>)}</div><div className="onboarding-footer"><span>Your choices are always editable from your profile.</span><button className="primary-button" onClick={() => { if (!canContinueWithInterests(selected)) { toast.error("Please select at least three interests."); return; } window.localStorage.setItem("trendx-interests", JSON.stringify(selected)); setMode("dashboard"); }}>Show my insights <ArrowRight size={16} /></button></div></main></div>;
}

function Dashboard({ setMode }: { setMode: (mode: Mode) => void }) { const name = window.localStorage.getItem("trendx-profile")?.split(" ")[0] || "there"; const selected = (() => { try { return JSON.parse(window.localStorage.getItem("trendx-interests") || "[]") as string[]; } catch { return []; } })(); const topics = selected.length ? selected : ["Technology", "Sports", "News"]; return <div className="simple-page"><header className="simple-header"><Logo /><div className="profile-chip"><span>{name.charAt(0).toUpperCase()}</span><b>{name}</b></div><button className="skip-link" onClick={() => setMode("interests")}>Edit interests</button></header><main className="dashboard-simple"><span className="simple-label">YOUR PERSONAL TRENDX</span><h1>Good to see you, {name}.</h1><p className="dashboard-subtitle">Here are a few signals shaped around what you care about.</p><div className="topic-row">{topics.map((topic) => <span key={topic}>{topic}</span>)}</div><section className="basic-feed"><article><span><TrendingUp size={13} /> RISING NOW</span><h2>What is gaining attention in your world?</h2><p>Explore new ideas, conversations, and opportunities connected to your interests.</p><button onClick={() => toast.info("Your live insights feed will be connected next.")}>Explore insights <ArrowRight size={15} /></button></article><article><span><Sparkles size={13} /> YOUR SIGNAL</span><h2>Keep your feed relevant</h2><p>Refine your interests anytime so TrendX can keep improving what it brings to you.</p><button onClick={() => setMode("interests")}>Update interests <ArrowRight size={15} /></button></article></section></main></div>; }

export default function Home() { const [mode, setMode] = useState<Mode>("login"); if (mode === "interests") return <InterestsPage setMode={setMode} />; if (mode === "dashboard") return <Dashboard setMode={setMode} />; return <AuthPage mode={mode} setMode={setMode} />; }
