import { HelpCircle, Info, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Avatar({ resident, size = "md" }) {
  return <span className={`avatar avatar-${size} avatar-${resident.color || "mint"}`} aria-label={resident.name}>{resident.initials}</span>;
}

export function ModeBadge({ mode }) {
  return <span className={`mode-badge mode-${mode.toLowerCase()}`}><span />{mode}</span>;
}

export function InfoTip({ label, text }) {
  return (
    <span className="info-tip" tabIndex="0" aria-label={`${label}: ${text}`}>
      <Info size={15} />
      <span className="tooltip"><strong>{label}</strong>{text}</span>
    </span>
  );
}

export function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}

export function Metric({ icon: Icon, value, label, detail, tip, tone = "mint" }) {
  return (
    <div className="metric">
      <span className={`metric-icon tone-${tone}`}><Icon size={21} /></span>
      <div><strong>{value}</strong><span>{label}{tip && <InfoTip label={label} text={tip} />}</span><small>{detail}</small></div>
    </div>
  );
}

export function EmptyState({ title = "Nessun risultato", description = "Prova a cambiare filtri o ricerca.", icon: Icon = HelpCircle }) {
  return <div className="empty-state"><Icon size={28} /><strong>{title}</strong><p>{description}</p></div>;
}

export function Modal({ open, title, onClose, children, size = "md" }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const handler = (event) => { if (event.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", handler);
    window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => { document.removeEventListener("keydown", handler); previous?.focus?.(); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Chiudi"><X size={18} /></button></header>
        {children}
      </section>
    </div>
  );
}

export function ProgressBar({ value, tone = "mint" }) {
  return <div className="progress-track" aria-label={`${value}%`}><span className={`tone-${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function DataExplanation({ children }) {
  return <div className="data-explanation"><Info size={15} />{children}</div>;
}
