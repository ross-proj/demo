import { Building2, HeartHandshake, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDemo } from "../state/DemoContext";

const perspectives = [
  { id: "structure", label: "Struttura", description: "Operatori", icon: Building2, path: "/" },
  { id: "family", label: "Famiglia", description: "Anna", icon: HeartHandshake, path: "/famiglia" },
  { id: "ross", label: "ROSS", description: "Elena", icon: Sparkles, path: "/ross" },
];

export function PerspectiveSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useDemo();
  const active = location.pathname.startsWith("/famiglia") ? "family" : location.pathname.startsWith("/ross") ? "ross" : "structure";

  const goTo = (perspective) => {
    if (perspective.id === "structure" && state.rossJourney.candidateId && !state.rossJourney.confirmedAt) {
      navigate("/ospiti/elena?tab=memorie");
      return;
    }
    navigate(perspective.path);
  };

  return (
    <nav className={`perspective-switcher perspective-${active}`} aria-label="Cambia prospettiva" data-testid="perspective-switcher">
      <span className="perspective-caption">VISTA DEMO</span>
      <div>
        {perspectives.map(({ id, label, description, icon: Icon, path }) => (
          <button key={id} type="button" className={active === id ? "active" : ""} aria-pressed={active === id} onClick={() => goTo({ id, path })}>
            <Icon size={17} />
            <span><strong>{label}</strong><small>{description}</small></span>
          </button>
        ))}
      </div>
    </nav>
  );
}
