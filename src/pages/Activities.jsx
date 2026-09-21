import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock3, Grid3X3, ListTree, MessageCircle, Music2, Plus, Sparkles, Users, X } from "lucide-react";
import { activities } from "../data/demoData";
import { useDemo } from "../state/DemoContext";
import { Modal, ProgressBar, SectionTitle } from "../components/Common";

const icons = { Conversazione: MessageCircle, Memoria: Sparkles, Musica: Music2, Giochi: Grid3X3, Socialità: Users };

export function Activities() {
  const [category, setCategory] = useState("Tutte");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [game, setGame] = useState(null);
  const navigate = useNavigate();
  const list = useMemo(() => category === "Tutte" ? activities : activities.filter((a) => a.category === category), [category]);
  return <div className="screen-enter">
    <SectionTitle eyebrow="ATTIVITÀ" title="Activity Center" description="Proposte comprensibili, configurabili e legate al contesto di ogni persona." action={<button className="primary-button" onClick={() => setBuilderOpen(true)}><Plus size={16} /> Crea attività</button>} />
    <div className="category-tabs">{["Tutte", "Conversazione", "Memoria", "Musica", "Giochi", "Socialità"].map((c) => <button className={category === c ? "active" : ""} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div>
    <div className="activity-grid">{list.map((activity) => { const Icon = icons[activity.category] || Sparkles; return <article className="activity-card surface" key={activity.id}><header><span className={`activity-icon tone-${activity.category === "Musica" ? "lilac" : activity.category === "Giochi" ? "sand" : "mint"}`}><Icon size={20} /></span><small>{activity.category}</small></header><h3>{activity.title}</h3><p>{activity.reason}</p><div className="activity-meta"><span><Clock3 size={14} /> {activity.duration} min</span><span>{activity.difficulty}</span><span>{activity.mode}</span></div><div className="activity-participation"><span>Partecipazione osservata</span><strong>{activity.participation}%</strong><ProgressBar value={activity.participation} tone="mint" /></div><footer><small>Ultima esecuzione: {activity.last}</small><button className="primary-button" onClick={() => activity.category === "Giochi" ? setGame(activity.id) : navigate("/interazione/elena")}>Avvia <ArrowRight size={15} /></button></footer></article>; })}</div>
    <ActivityBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} onStart={() => { setBuilderOpen(false); navigate("/interazione/elena"); }} />
    <GameOverlay game={game} onClose={() => setGame(null)} />
  </div>;
}

function ActivityBuilder({ open, onClose, onStart }) {
  const [form, setForm] = useState({ type: "Ricordi guidati", duration: "15", topic: "Viaggi", resident: "Elena Bianchi", level: "Leggera", group: "Individuale", memory: "Viaggio a Palermo" });
  return <Modal open={open} title="Crea attività" onClose={onClose} size="lg"><div className="builder-grid"><form className="form-grid">{Object.entries({ type: "Tipologia", duration: "Durata", topic: "Argomento", resident: "Ospite", level: "Complessità", group: "Modalità", memory: "Memoria da utilizzare" }).map(([key, label]) => <label key={key}>{label}<select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>{key === "type" ? ["Ricordi guidati", "Conversazione libera", "Fotografie", "Musica"].map((v) => <option key={v}>{v}</option>) : key === "duration" ? ["10", "15", "20"].map((v) => <option key={v} value={v}>{v} minuti</option>) : key === "level" ? ["Leggera", "Media"].map((v) => <option key={v}>{v}</option>) : key === "group" ? ["Individuale", "Gruppo"].map((v) => <option key={v}>{v}</option>) : <><option>{form[key]}</option><option>Nessuna preferenza</option></>}</select></label>)}</form><aside className="activity-preview"><span className="eyebrow">ANTEPRIMA ROSS</span><div className="activity-icon"><Sparkles size={24} /></div><h3>{form.type}</h3><p>Una sessione di {form.duration} minuti su <strong>{form.topic.toLowerCase()}</strong>, partendo dalla memoria “{form.memory}”.</p><div><span>{form.resident}</span><span>{form.level}</span><span>{form.group}</span></div><p className="preview-copy">“Elena, ti andrebbe di riprendere le fotografie del viaggio in Sicilia?”</p></aside></div><div className="modal-actions"><button className="ghost-button" onClick={onClose}>Salva bozza</button><button className="primary-button" onClick={onStart}>Avvia attività <ArrowRight size={16} /></button></div></Modal>;
}

function GameOverlay({ game, onClose }) {
  const { actions } = useDemo();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState(["fiore", "mare", "tazza", "fiore", "mare", "tazza"].map((value, index) => ({ value, index, open: false, matched: false })));
  const [first, setFirst] = useState(null);
  if (!game) return null;
  const finish = () => { actions.completeInteraction({ residentId: "elena", resident: "Elena Bianchi", time: "17:10", duration: 7, type: "Gioco", topic: game, mode: "Attiva", participation: 84, memoriesUsed: 1, emerged: 0 }); onClose(); };
  const flip = (index) => {
    if (cards[index].matched || cards[index].open) return;
    const next = cards.map((c) => c.index === index ? { ...c, open: true } : c);
    if (first == null) { setCards(next); setFirst(index); return; }
    if (next[first].value === next[index].value) { setCards(next.map((c) => c.value === next[index].value ? { ...c, matched: true } : c)); setScore(score + 1); setFirst(null); }
    else { setCards(next); window.setTimeout(() => { setCards((current) => current.map((c) => c.matched ? c : { ...c, open: false })); setFirst(null); }, 650); }
  };
  const title = game === "memory-game" ? "Memory visivo" : game === "categories" ? "Categorie" : "Associazioni";
  return <div className="game-overlay"><header><div><span>ROSS con Elena</span><h2>{title}</h2></div><button onClick={onClose}><X /></button></header><main>
    {game === "memory-game" ? <><p>Trova le tre coppie. Il risultato descrive solo questa partita.</p><div className="memory-game">{cards.map((card) => <button className={card.open || card.matched ? "open" : ""} key={card.index} onClick={() => flip(card.index)}>{card.open || card.matched ? card.value : "?"}</button>)}</div><strong>{score} coppie trovate su 3</strong></> : game === "categories" ? <CategoryGame step={step} setStep={setStep} /> : <AssociationGame step={step} setStep={setStep} />}
  </main><footer><span>Nessuna valutazione clinica</span><button className="primary-button" onClick={finish}>{(game === "memory-game" ? score === 3 : step >= 2) ? "Termina attività" : "Concludi ora"}</button></footer></div>;
}

function CategoryGame({ step, setStep }) { const prompts = ["Dimmi qualcosa che trovi in un giardino", "Dimmi qualcosa che si ascolta", "Dimmi qualcosa che ricorda l'estate"]; const [value, setValue] = useState(""); return <div className="simple-game"><span>{step + 1} / 3</span><h3>{prompts[Math.min(step, 2)]}</h3><div><input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Scrivi la risposta di Elena" /><button disabled={!value} onClick={() => { setValue(""); setStep(Math.min(3, step + 1)); }}>{step >= 2 ? "Completa" : "Continua"}</button></div></div>; }
function AssociationGame({ step, setStep }) { const sets = [["Mare", "Conchiglia", "Montagna"], ["Musica", "Radio", "Giornale"], ["Giardino", "Geranio", "Treno"]]; return <div className="simple-game"><span>{step + 1} / 3</span><h3>Quale parola senti più vicina?</h3><div className="choice-row">{sets[Math.min(step, 2)].map((v) => <button key={v} onClick={() => setStep(Math.min(3, step + 1))}>{v}</button>)}</div></div>; }
