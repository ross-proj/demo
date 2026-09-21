import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { biography as initialBiography, interactions as initialInteractions, memories as initialMemories, modeSchedule as initialSchedule, residents as initialResidents } from "../data/demoData";

const DemoContext = createContext(null);
const STORAGE_KEY = "ross-rsa-demo-v2";

function getInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* localStorage can be unavailable in private contexts */ }
  return {
    theme: "ross",
    presentation: new URLSearchParams(window.location.search).get("presentation") === "true",
    residents: initialResidents,
    memories: initialMemories,
    interactions: initialInteractions,
    biography: initialBiography,
    schedule: initialSchedule,
    notes: [],
    takenInsights: [],
  };
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(getInitialState);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.presentation = state.presentation ? "true" : "false";
  }, [state]);

  const notify = (message, tone = "success") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const actions = useMemo(() => ({
    setTheme: (theme) => setState((prev) => ({ ...prev, theme })),
    togglePresentation: () => setState((prev) => ({ ...prev, presentation: !prev.presentation })),
    setResidentMode: (residentId, mode) => {
      setState((prev) => ({ ...prev, residents: prev.residents.map((r) => r.id === residentId ? { ...r, mode, status: mode === "Silenziosa" ? "Riposo" : r.status } : r) }));
      notify(`Modalità ${mode.toLowerCase()} attivata`);
    },
    updateSchedule: (index, patch) => setState((prev) => ({ ...prev, schedule: prev.schedule.map((item, i) => i === index ? { ...item, ...patch } : item) })),
    confirmMemory: (memory) => {
      setState((prev) => {
        const exists = prev.memories.some((m) => m.id === memory.id);
        return { ...prev, memories: exists ? prev.memories.map((m) => m.id === memory.id ? { ...m, status: "Confermata", confidence: 100 } : m) : [{ ...memory, status: "Confermata", confidence: 100 }, ...prev.memories] };
      });
      notify("Memoria confermata e collegata al profilo");
    },
    archiveMemory: (id) => {
      setState((prev) => ({ ...prev, memories: prev.memories.filter((m) => m.id !== id) }));
      notify("Memoria archiviata", "neutral");
    },
    addBiographyEvent: (event) => {
      setState((prev) => ({ ...prev, biography: [...prev.biography, event].sort((a, b) => a.year.localeCompare(b.year)) }));
      notify("Evento aggiunto alla storia");
    },
    completeInteraction: (interaction) => {
      setState((prev) => ({ ...prev, interactions: [{ id: `local-${Date.now()}`, date: "2026-09-21", ...interaction }, ...prev.interactions] }));
      notify("Interazione aggiunta allo storico");
    },
    addNote: (note) => {
      setState((prev) => ({ ...prev, notes: [{ id: Date.now(), ...note }, ...prev.notes] }));
      notify("Nota operatore aggiunta");
    },
    takeInsight: (id) => {
      setState((prev) => ({ ...prev, takenInsights: [...new Set([...prev.takenInsights, id])] }));
      notify("Elemento preso in carico");
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState({ theme: "ross", presentation: false, residents: initialResidents, memories: initialMemories, interactions: initialInteractions, biography: initialBiography, schedule: initialSchedule, notes: [], takenInsights: [] });
      notify("Demo ripristinata");
    },
  }), []);

  return <DemoContext.Provider value={{ state, actions, toast, notify }}>{children}</DemoContext.Provider>;
}

export const useDemo = () => useContext(DemoContext);
