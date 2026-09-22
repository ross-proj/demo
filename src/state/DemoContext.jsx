import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { biography as initialBiography, interactions as initialInteractions, memories as initialMemories, modeSchedule as initialSchedule, residents as initialResidents } from "../data/demoData";

const DemoContext = createContext(null);
const STORAGE_KEY = "ross-rsa-demo-v2";

const initialRossJourney = {
  stage: "ready",
  completedAt: null,
  candidateId: null,
  confirmedAt: null,
};

function defaultState() {
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
    familyContributions: [],
    rossJourney: initialRossJourney,
  };
}

function getInitialState() {
  const defaults = defaultState();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaults,
        ...parsed,
        presentation: new URLSearchParams(window.location.search).get("presentation") === "true" || Boolean(parsed.presentation),
        familyContributions: parsed.familyContributions || [],
        rossJourney: { ...initialRossJourney, ...(parsed.rossJourney || {}) },
      };
    }
  } catch { /* localStorage can be unavailable in private contexts */ }
  return defaults;
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
      setState((prev) => ({ ...prev, residents: prev.residents.map((r) => r.id === residentId ? { ...r, mode, status: mode === "Silenziosa" || mode === "Riposo" ? "Riposo" : "Disponibile" } : r) }));
      notify(`Modalità ${mode.toLowerCase()} attivata`);
    },
    updateSchedule: (index, patch) => setState((prev) => ({ ...prev, schedule: prev.schedule.map((item, i) => i === index ? { ...item, ...patch } : item) })),
    confirmMemory: (memory) => {
      setState((prev) => {
        const exists = prev.memories.some((m) => m.id === memory.id);
        const memories = exists ? prev.memories.map((m) => m.id === memory.id ? { ...m, status: "Confermata", confidence: 100 } : m) : [{ ...memory, status: "Confermata", confidence: 100 }, ...prev.memories];
        const isRossCandidate = memory.id === "ross-cefalu-camera";
        const biographyEvent = { year: "1998", title: "La macchina fotografica di Paolo", description: "Durante il viaggio in Sicilia Paolo portava una piccola macchina fotografica rossa e fotografava Elena sul lungomare di Cefalù.", place: "Cefalù", people: ["Paolo"], source: "Confermata da Elena" };
        const biography = isRossCandidate && !prev.biography.some((event) => event.title === biographyEvent.title)
          ? [...prev.biography, biographyEvent].sort((a, b) => a.year.localeCompare(b.year))
          : prev.biography;
        return {
          ...prev,
          memories,
          biography,
          rossJourney: isRossCandidate ? { ...prev.rossJourney, confirmedAt: new Date().toISOString() } : prev.rossJourney,
        };
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
    setRossStage: (stage) => setState((prev) => ({ ...prev, rossJourney: { ...prev.rossJourney, stage } })),
    restartRossJourney: () => setState((prev) => ({ ...prev, rossJourney: { ...prev.rossJourney, stage: "ready" } })),
    completeRossConversation: () => {
      const memory = {
        id: "ross-cefalu-camera",
        residentId: "elena",
        title: "La macchina fotografica rossa di Paolo",
        category: "Ricordi",
        description: "Durante il viaggio del 1998 Paolo portava una piccola macchina fotografica rossa e fotografava Elena sul lungomare di Cefalù.",
        source: "Conversazione con ROSS · oggi",
        status: "Da verificare",
        confidence: 78,
        lastUsed: "Oggi, 17:18",
        tags: ["Cefalù", "Paolo", "fotografia", "1998"],
        people: ["Paolo"],
      };
      setState((prev) => {
        const memories = prev.memories.some((item) => item.id === memory.id) ? prev.memories : [memory, ...prev.memories];
        const interaction = {
          id: "ross-story-2026-09-21",
          residentId: "elena",
          resident: "Elena Bianchi",
          date: "2026-09-21",
          time: "17:18",
          duration: 14,
          type: "Conversazione",
          topic: "Cefalù e fotografie",
          mode: "Attiva",
          participation: 89,
          memoriesUsed: 3,
          emerged: 1,
        };
        const interactions = prev.interactions.some((item) => item.id === interaction.id) ? prev.interactions : [interaction, ...prev.interactions];
        return {
          ...prev,
          memories,
          interactions,
          rossJourney: { stage: "complete", completedAt: new Date().toISOString(), candidateId: memory.id, confirmedAt: prev.rossJourney.confirmedAt },
        };
      });
      notify("Conversazione salvata: è emerso un nuovo ricordo");
    },
    addFamilyContribution: (contribution) => {
      setState((prev) => ({ ...prev, familyContributions: [{ id: `family-${Date.now()}`, createdAt: new Date().toISOString(), ...contribution }, ...prev.familyContributions] }));
      notify("Contributo condiviso con la storia di Elena");
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
      setState({ ...defaultState(), presentation: false });
      notify("Demo ripristinata");
    },
  }), []);

  return <DemoContext.Provider value={{ state, actions, toast, notify }}>{children}</DemoContext.Provider>;
}

export const useDemo = () => useContext(DemoContext);
