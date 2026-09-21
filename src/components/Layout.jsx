import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, BarChart3, Building2, ClipboardCheck, FileText, Home, Lightbulb, Menu, Palette, Play, Search, Settings, Sparkles, Users, X } from "lucide-react";
import { activities, insights, residents } from "../data/demoData";
import { useDemo } from "../state/DemoContext";
import { Modal, ModeBadge } from "./Common";

const nav = [
  ["/", "Panoramica", Home], ["/ospiti", "Ospiti", Users], ["/attivita", "Attività", Activity], ["/interazioni", "Interazioni", Sparkles], ["/consegne", "Passaggio consegne", ClipboardCheck], ["/insight", "Insight", Lightbulb], ["/analytics", "Analytics", BarChart3], ["/report", "Report", FileText], ["/struttura", "Struttura", Building2],
];
const presentationRoutes = ["/", "/ospiti/elena?tab=relazioni", "/ospiti/elena?tab=memorie", "/attivita", "/interazione/elena", "/report", "/consegne"];

export function Layout() {
  const { state, actions, toast } = useDemo();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const residentResults = residents.filter((r) => `${r.name} ${r.room} ${r.interests.join(" ")}`.toLowerCase().includes(q)).map((r) => ({ type: "Ospite", title: r.name, detail: `Stanza ${r.room}`, path: `/ospiti/${r.id}` }));
    const activityResults = activities.filter((a) => `${a.title} ${a.category} ${a.reason}`.toLowerCase().includes(q)).map((a) => ({ type: "Attività", title: a.title, detail: a.category, path: "/attivita" }));
    const insightResults = insights.filter((i) => `${i.title} ${i.body}`.toLowerCase().includes(q)).map((i) => ({ type: "Insight", title: i.title, detail: i.period, path: "/insight" }));
    const semantic = q.includes("sicilia") || q.includes("palermo") || q.includes("cefalù") ? [
      { type: "Memoria", title: "Viaggio a Palermo", detail: "Elena · confermata", path: "/ospiti/elena?tab=memorie" },
      { type: "Conversazione", title: "Vacanze in Sicilia", detail: "12 settembre · 16 min", path: "/interazioni" },
      { type: "Attività", title: "Fotografie di viaggio", detail: "Suggerita per Elena", path: "/attivita" },
    ] : [];
    return [...semantic, ...residentResults, ...activityResults, ...insightResults].slice(0, 8);
  }, [query]);

  const nextPresentation = () => {
    const current = presentationRoutes.findIndex((r) => r.split("?")[0] === location.pathname);
    navigate(presentationRoutes[(current + 1) % presentationRoutes.length]);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><span className="brand-mark">R</span><strong>R.O.S.S.</strong><button className="sidebar-close" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <nav>{nav.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setMenuOpen(false)}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
        <div className="sidebar-bottom">
          <button onClick={() => setSearchOpen(true)}><Search size={18} /><span>Cerca</span><kbd>⌘K</kbd></button>
          <NavLink to="/impostazioni"><Settings size={18} /><span>Impostazioni</span></NavLink>
          <div className="operator"><span>GS</span><div><strong>Giulia Serra</strong><small>Coordinatrice</small></div></div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Apri menu"><Menu /></button>
          <div><span className="facility">RESIDENZA AURORA</span><span className="date">Lunedì, 21 settembre 2026</span></div>
          <div className="top-actions">
            <button className={`presentation-toggle ${state.presentation ? "active" : ""}`} onClick={actions.togglePresentation}><Play size={15} fill="currentColor" /> Presentazione</button>
            <button className="theme-quick" onClick={() => navigate("/impostazioni")} title="Tema e impostazioni"><Palette size={18} /></button>
            <ModeBadge mode="Attiva" />
          </div>
        </header>
        <main className="page"><Outlet /></main>
      </div>
      {state.presentation && <button className="demo-next" onClick={nextPresentation}>Avanti nella demo <span>→</span></button>}
      {toast && <div className={`toast toast-${toast.tone}`}><ClipboardCheck size={18} />{toast.message}</div>}
      <Modal open={searchOpen} title="Cerca in ROSS" onClose={() => { setSearchOpen(false); setQuery(""); }} size="lg">
        <div className="command-search"><Search size={20} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca ospiti, memorie, attività, insight…" /></div>
        <div className="search-results">
          {!query && <div className="search-hint"><strong>Prova “Sicilia”</strong><span>ROSS collega persone, memorie, conversazioni e attività.</span></div>}
          {query && !results.length && <div className="search-hint"><strong>Nessun risultato</strong><span>Controlla il termine o cerca un'altra parola.</span></div>}
          {results.map((result) => <button key={`${result.type}-${result.title}`} onClick={() => { navigate(result.path); setSearchOpen(false); setQuery(""); }}><span>{result.type}</span><strong>{result.title}</strong><small>{result.detail}</small></button>)}
        </div>
      </Modal>
    </div>
  );
}
