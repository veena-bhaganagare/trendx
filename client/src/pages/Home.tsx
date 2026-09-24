import { FormEvent, useMemo, useState } from "react";
import { startLogin } from "@/const";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  EyeOff,
  Flame,
  Globe2,
  HeartPulse,
  LayoutGrid,
  LockKeyhole,
  Menu,
  MonitorDot,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  canContinueWithInterests,
  filterInterests,
  toggleInterestSelection,
} from "@/lib/trendx";

type Mode = "login" | "signup" | "interests" | "dashboard";
type Category = "All" | "Trending" | "Learn" | "Build" | "Live";

type Interest = {
  label: string;
  category: Exclude<Category, "All">;
  icon: string;
  accent: string;
};

const interestGroups: Record<Exclude<Category, "All">, Interest[]> = {
  Trending: [
    { label: "News", category: "Trending", icon: "◉", accent: "coral" },
    { label: "India", category: "Trending", icon: "✦", accent: "lime" },
    { label: "World Affairs", category: "Trending", icon: "◎", accent: "blue" },
    { label: "Politics", category: "Trending", icon: "⌁", accent: "violet" },
    { label: "Social Impact", category: "Trending", icon: "♥", accent: "pink" },
    { label: "Climate Change", category: "Trending", icon: "☼", accent: "mint" },
  ],
  Learn: [
    { label: "Competitive Exams", category: "Learn", icon: "✎", accent: "yellow" },
    { label: "UPSC", category: "Learn", icon: "◈", accent: "blue" },
    { label: "JEE", category: "Learn", icon: "∑", accent: "coral" },
    { label: "NEET", category: "Learn", icon: "✚", accent: "pink" },
    { label: "Science", category: "Learn", icon: "⚛", accent: "violet" },
    { label: "Research", category: "Learn", icon: "⌕", accent: "mint" },
    { label: "Education", category: "Learn", icon: "▤", accent: "yellow" },
    { label: "Languages", category: "Learn", icon: "文", accent: "blue" },
  ],
  Build: [
    { label: "Technology", category: "Build", icon: "⌘", accent: "blue" },
    { label: "Artificial Intelligence", category: "Build", icon: "✺", accent: "lime" },
    { label: "Startups", category: "Build", icon: "↗", accent: "coral" },
    { label: "Coding", category: "Build", icon: "</>", accent: "violet" },
    { label: "Web Development", category: "Build", icon: "◌", accent: "mint" },
    { label: "Cybersecurity", category: "Build", icon: "⌬", accent: "pink" },
    { label: "Business", category: "Build", icon: "◫", accent: "yellow" },
    { label: "Finance", category: "Build", icon: "₹", accent: "lime" },
    { label: "Entrepreneurship", category: "Build", icon: "◆", accent: "coral" },
    { label: "Marketing", category: "Build", icon: "⌁", accent: "blue" },
    { label: "Robotics", category: "Build", icon: "⬡", accent: "violet" },
    { label: "Fintech", category: "Build", icon: "₿", accent: "yellow" },
  ],
  Live: [
    { label: "Sports", category: "Live", icon: "◒", accent: "coral" },
    { label: "Health & Fitness", category: "Live", icon: "♡", accent: "pink" },
    { label: "Mental Health", category: "Live", icon: "◡", accent: "mint" },
    { label: "Gaming", category: "Live", icon: "⌁", accent: "violet" },
    { label: "Entertainment", category: "Live", icon: "▸", accent: "coral" },
    { label: "Music", category: "Live", icon: "♫", accent: "yellow" },
    { label: "Travel", category: "Live", icon: "✈", accent: "blue" },
    { label: "Food", category: "Live", icon: "◌", accent: "lime" },
    { label: "Books", category: "Live", icon: "▥", accent: "violet" },
    { label: "Design", category: "Live", icon: "✣", accent: "pink" },
    { label: "Productivity", category: "Live", icon: "✓", accent: "mint" },
    { label: "Fashion", category: "Live", icon: "✦", accent: "coral" },
  ],
};

const categories: { label: Category; icon: string }[] = [
  { label: "All", icon: "⌘" },
  { label: "Trending", icon: "✦" },
  { label: "Learn", icon: "◈" },
  { label: "Build", icon: "↗" },
  { label: "Live", icon: "◒" },
];

const allInterests = Object.values(interestGroups).flat();

function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <div className={`brand ${dark ? "brand-dark" : "brand-light"}`} aria-label="TrendX home">
      <span className="brand-mark"><span /></span>
      <span>Trend<span className="brand-x">X</span></span>
    </div>
  );
}

function GoogleMark() {
  return <span className="google-mark" aria-hidden="true">G</span>;
}

function AuthShell({
  mode,
  setMode,
}: {
  mode: "login" | "signup";
  setMode: (mode: Mode) => void;
}) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const handleGoogle = () => {
    setGoogleBusy(true);
    toast.success("Opening secure Google sign-in…");
    startLogin();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");

    if (!email.trim() || !password.trim() || (isSignup && !profileName.trim())) {
      setFormMessage("Please complete the required fields to continue.");
      return;
    }
    if (isSignup && password.length < 8) {
      setFormMessage("Use at least 8 characters for a stronger password.");
      return;
    }
    if (isSignup && password !== confirmPassword) {
      setFormMessage("Your passwords do not match yet.");
      return;
    }
    if (isSignup && !accepted) {
      setFormMessage("Please accept the terms to create your profile.");
      return;
    }

    if (isSignup) {
      window.localStorage.setItem("trendx-profile", profileName);
      toast.success("Profile created. Let’s tune your TrendX feed.");
      setMode("interests");
    } else {
      toast.success("Welcome back to TrendX.");
      setMode("dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-noise" />
      <div className="auth-topbar">
        <Logo />
        <div className="auth-topbar-note"><ShieldCheck size={14} /> Your data stays yours</div>
      </div>
      <div className="auth-layout">
        <section className="auth-story">
          <div className="story-kicker"><span className="pulse-dot" /> The internet, made relevant</div>
          <h1>Stay curious.<br /><em>Move ahead.</em></h1>
          <p className="story-copy">TrendX turns the noise of now into a signal you can use — personalized to the things you care about.</p>
          <div className="story-stats">
            <div><strong>04</strong><span>signal layers</span></div>
            <div><strong>∞</strong><span>ways to discover</span></div>
            <div><strong>01</strong><span>feed, made yours</span></div>
          </div>
          <div className="story-orbit" aria-hidden="true">
            <div className="orbit-ring orbit-ring-one" />
            <div className="orbit-ring orbit-ring-two" />
            <div className="orbit-core"><Sparkles size={18} /><span>your signal</span></div>
            <div className="orbit-pill orbit-pill-one"><Zap size={13} /> AI x India</div>
            <div className="orbit-pill orbit-pill-two"><Flame size={13} /> Sports</div>
            <div className="orbit-pill orbit-pill-three"><Trophy size={13} /> UPSC</div>
          </div>
        </section>

        <section className="auth-card-wrap">
          <div className="auth-card">
            <div className="auth-card-header">
              <div className="card-overline">{isSignup ? "FIRST, A LITTLE ABOUT YOU" : "WELCOME BACK"}</div>
              <h2>{isSignup ? "Create your signal" : "Sign in to TrendX"}</h2>
              <p>{isSignup ? "A sharper feed starts with a few simple details." : "Pick up where your curiosity left off."}</p>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
              <button className={!isSignup ? "active" : ""} onClick={() => { setMode("login"); setFormMessage(""); }} role="tab" aria-selected={!isSignup}>Sign in</button>
              <button className={isSignup ? "active" : ""} onClick={() => { setMode("signup"); setFormMessage(""); }} role="tab" aria-selected={isSignup}>Create account</button>
            </div>

            <button className="google-button" type="button" onClick={handleGoogle} disabled={googleBusy}>
              {googleBusy ? <span className="button-loader" /> : <GoogleMark />}
              {googleBusy ? "Connecting securely…" : "Continue with Google"}
              <ChevronRight size={16} className="button-arrow" />
            </button>
            <div className="auth-divider"><span>or use your email</span></div>

            <form onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <label className="field-label">Full name
                  <span className="input-shell"><UserRound size={16} /><input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g. Arjun Mehta" autoComplete="name" /></span>
                </label>
              )}
              <label className="field-label">Email or username
                <span className="input-shell"><span className="input-prefix">@</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></span>
              </label>
              <label className="field-label">Password
                <span className="input-shell"><LockKeyhole size={16} /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={isSignup ? "new-password" : "current-password"} /><button type="button" className="input-action" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
              </label>
              {isSignup && (
                <label className="field-label">Confirm password
                  <span className="input-shell"><LockKeyhole size={16} /><input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" /><button type="button" className="input-action" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
                </label>
              )}

              {!isSignup ? (
                <div className="form-meta"><label className="checkbox-line"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="text-button" onClick={() => toast.info("Password recovery will be connected to your auth provider.")}>Forgot password?</button></div>
              ) : (
                <label className="checkbox-line terms-line"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /> <span>I agree to the <button type="button" className="inline-link" onClick={() => toast.info("Terms preview coming in the next build.")}>Terms</button> and <button type="button" className="inline-link" onClick={() => toast.info("Privacy preview coming in the next build.")}>Privacy Policy</button></span></label>
              )}

              {formMessage && <div className="form-message" role="alert">{formMessage}</div>}
              <button className="primary-button" type="submit">{isSignup ? "Create my account" : "Sign in"}<ArrowRight size={17} /></button>
            </form>
            <p className="secure-note"><ShieldCheck size={14} /> Secure by design · No spam, ever</p>
          </div>
          <div className="auth-footer"><span>© 2026 TrendX</span><span>Built for the curious</span><button onClick={() => toast.info("Help center coming soon.")}><CircleHelp size={14} /> Help</button></div>
        </section>
      </div>
    </div>
  );
}

function InterestsPage({ setMode, profileName }: { setMode: (mode: Mode) => void; profileName: string }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem("trendx-interests");
      return saved ? JSON.parse(saved) : ["Artificial Intelligence", "Technology", "Competitive Exams"];
    } catch {
      return ["Artificial Intelligence", "Technology", "Competitive Exams"];
    }
  });

  const filteredInterests = useMemo(() => {
    return filterInterests(allInterests, activeCategory, query);
  }, [activeCategory, query]);

  const toggleInterest = (label: string) => {
    setSelected((current) => toggleInterestSelection(current, label));
  };

  const continueToDashboard = () => {
    if (!canContinueWithInterests(selected)) {
      toast.error("Pick at least three interests to tune your feed.");
      return;
    }
    window.localStorage.setItem("trendx-interests", JSON.stringify(selected));
    window.localStorage.setItem("trendx-onboarded", "true");
    toast.success("Your signal is ready.");
    setMode("dashboard");
  };

  return (
    <div className="onboarding-page">
      <header className="onboarding-header"><Logo /><div className="onboarding-progress"><span className="progress-done">01</span><span className="progress-line active" /><span>02</span><span className="progress-label">Tune your feed</span></div><button className="skip-button" onClick={() => setMode("dashboard")}>Skip for now <ArrowRight size={15} /></button></header>
      <main className="interests-main">
        <div className="interests-heading"><div className="eyebrow"><span className="pulse-dot" /> PERSONALIZE YOUR SIGNAL</div><h1>What are you<br /><em>into lately?</em></h1><p>Choose three or more topics. TrendX will turn them into a feed that feels like it was made for you.</p></div>
        <div className="interest-toolbar"><div className="category-tabs" role="tablist">{categories.map((category) => <button key={category.label} className={activeCategory === category.label ? "active" : ""} onClick={() => setActiveCategory(category.label)} role="tab" aria-selected={activeCategory === category.label}><span>{category.icon}</span>{category.label}</button>)}</div><label className="search-shell"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find an interest" aria-label="Find an interest" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label></div>
        <div className="selection-bar"><span><strong>{selected.length}</strong> selected <span className="selection-help">{selected.length >= 3 ? "· Your feed is taking shape" : "· Choose at least 3"}</span></span><div className="selected-preview">{selected.slice(0, 4).map((item) => <span key={item}>{item}</span>)}{selected.length > 4 && <span>+{selected.length - 4}</span>}</div></div>
        <div className="interest-grid">{filteredInterests.map((interest) => { const isSelected = selected.includes(interest.label); return <button key={interest.label} className={`interest-card accent-${interest.accent} ${isSelected ? "selected" : ""}`} onClick={() => toggleInterest(interest.label)} aria-pressed={isSelected}><span className="interest-icon">{interest.icon}</span><span className="interest-label">{interest.label}</span><span className="interest-check">{isSelected ? <Check size={14} /> : <ArrowRight size={14} />}</span></button>; })}</div>
        {filteredInterests.length === 0 && <div className="empty-search"><Search size={22} /><strong>No interests found</strong><span>Try a different phrase or browse another category.</span></div>}
        <div className="interests-bottom"><div className="privacy-copy"><ShieldCheck size={16} /><span>Your choices shape your feed, not your identity.<br /><a href="#privacy" onClick={(e) => { e.preventDefault(); toast.info("Privacy details coming soon."); }}>Read our privacy promise</a></span></div><button className="primary-button continue-button" onClick={continueToDashboard}>Continue to TrendX <ArrowRight size={17} /></button></div>
      </main>
    </div>
  );
}

function Dashboard({ setMode, profileName }: { setMode: (mode: Mode) => void; profileName: string }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [activeNav, setActiveNav] = useState("Home");
  const firstName = profileName.split(" ")[0] || "Arjun";
  const interests = ["Artificial Intelligence", "Technology", "Competitive Exams", "Startups"];

  const storyCards = [
    { tag: "TECH / 08 MIN READ", title: "The quiet race to build India’s most useful AI layer", copy: "Why the next wave of AI is moving from demos into daily workflows.", accent: "blue", metric: "+42%", icon: <MonitorDot size={18} /> },
    { tag: "EXAM DESK / 05 MIN READ", title: "UPSC 2026: The themes hiding in plain sight", copy: "A clean, high-signal map of what serious aspirants are tracking.", accent: "coral", metric: "12k", icon: <Star size={18} /> },
    { tag: "STARTUPS / 06 MIN READ", title: "The new Indian founder playbook is more global", copy: "Capital is cautious. Ambition isn’t.", accent: "lime", metric: "3.8x", icon: <Zap size={18} /> },
  ];

  const toggleSaved = (title: string) => setSaved((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar"><Logo /><div className="sidebar-label">YOUR SIGNAL</div><nav>{[{ label: "Home", icon: <LayoutGrid size={17} /> }, { label: "Explore", icon: <Search size={17} /> }, { label: "Saved", icon: <Bookmark size={17} /> }, { label: "My interests", icon: <Sparkles size={17} /> }].map((item) => <button key={item.label} className={activeNav === item.label ? "active" : ""} onClick={() => { setActiveNav(item.label); if (item.label === "My interests") setMode("interests"); else if (item.label !== "Home") toast.info(`${item.label} is part of the next TrendX release.`); }}>{item.icon}<span>{item.label}</span>{item.label === "Saved" && saved.length > 0 && <b>{saved.length}</b>}</button>)}</nav><div className="sidebar-bottom"><button onClick={() => toast.info("Your preferences are already private by default.")}><ShieldCheck size={16} /> Privacy-first</button><button className="profile-mini" onClick={() => toast.info("Profile settings coming soon.")}><span className="avatar">{firstName.charAt(0)}</span><span><strong>{firstName}</strong><small>Personal profile</small></span><ChevronRight size={14} /></button></div></aside>
      <main className="dashboard-main"><header className="dashboard-topbar"><div className="mobile-logo"><Logo /></div><div className="dashboard-search"><Search size={17} /><input placeholder="Search your signal" /><span>⌘ K</span></div><div className="dashboard-actions"><button onClick={() => toast.info("You’re all caught up.")} aria-label="Notifications"><Bell size={18} /><i /></button><button className="avatar dashboard-avatar" onClick={() => toast.info("Profile settings coming soon.")}>{firstName.charAt(0)}</button></div></header><div className="dashboard-content"><div className="dashboard-welcome"><div><div className="eyebrow"><span className="pulse-dot" /> WEDNESDAY, 24 SEPTEMBER 2026</div><h1>Good evening, <em>{firstName}.</em></h1><p>Here’s what’s moving in your world right now.</p></div><button className="tune-button" onClick={() => setMode("interests")}><Sparkles size={15} /> Tune my feed</button></div><section className="signal-hero"><div className="signal-copy"><div className="section-kicker"><span className="kicker-dot" /> YOUR DAILY SIGNAL <span className="kicker-time">Updated 4m ago</span></div><h2>Three things<br /><em>worth your attention.</em></h2><p>A concise pulse across the topics you chose. No doomscrolling required.</p><button className="hero-button" onClick={() => toast.success("Your daily signal is marked as read.")}>Open today’s signal <ArrowRight size={17} /></button></div><div className="signal-visual" aria-hidden="true"><div className="signal-grid" /><div className="signal-orbit large" /><div className="signal-orbit small" /><div className="signal-node node-one">AI</div><div className="signal-node node-two">IN</div><div className="signal-node node-three">+42%</div><div className="signal-center"><Flame size={24} /><span>signal<br /><b>08.4</b></span></div></div></section><div className="section-heading"><div><span className="section-number">01</span><h3>For you, <em>right now</em></h3></div><button className="see-all" onClick={() => toast.info("Explore view coming soon.")}>See all <ArrowRight size={15} /></button></div><div className="story-grid">{storyCards.map((story) => <article key={story.title} className={`story-card story-${story.accent}`}><div className="story-card-top"><span className="story-icon">{story.icon}</span><span className="story-metric">{story.metric} <small>↑</small></span></div><div className="story-tag">{story.tag}</div><h4>{story.title}</h4><p>{story.copy}</p><div className="story-card-bottom"><span>Read story <ArrowRight size={14} /></span><button onClick={() => toggleSaved(story.title)} aria-label={saved.includes(story.title) ? "Remove from saved" : "Save story"}>{saved.includes(story.title) ? <Bookmark size={16} fill="currentColor" /> : <Bookmark size={16} />}</button></div></article>)}</div><section className="dashboard-lower"><div className="topic-panel"><div className="lower-heading"><div><span className="section-number">02</span><h3>Your <em>signal map</em></h3></div><button onClick={() => setMode("interests")}>Edit <ArrowRight size={14} /></button></div><p className="lower-copy">Your feed is tuned to the ideas you want more of.</p><div className="topic-cloud">{interests.map((interest, index) => <span key={interest} className={`cloud-pill cloud-${index}`}>{interest}<small>{[82, 71, 64, 48][index]}%</small></span>)}</div></div><div className="streak-panel"><div className="streak-icon"><Flame size={22} /></div><span className="section-number">03</span><h3>Keep your<br /><em>curiosity streak.</em></h3><p>You’ve explored TrendX for 4 days in a row. Keep going.</p><div className="streak-days"><span className="done">M</span><span className="done">T</span><span className="done">W</span><span> T </span><span> F </span><span> S </span><span> S </span></div></div></section></div></main></div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("login");
  const [profileName, setProfileName] = useState(() => {
    try { return window.localStorage.getItem("trendx-profile") || "Arjun Mehta"; } catch { return "Arjun Mehta"; }
  });

  const handleMode = (nextMode: Mode) => {
    if (nextMode === "dashboard") {
      try { setProfileName(window.localStorage.getItem("trendx-profile") || profileName); } catch { /* local storage is optional in preview */ }
    }
    setMode(nextMode);
  };

  if (mode === "interests") return <InterestsPage setMode={handleMode} profileName={profileName} />;
  if (mode === "dashboard") return <Dashboard setMode={handleMode} profileName={profileName} />;
  return <AuthShell mode={mode} setMode={handleMode} />;
}
