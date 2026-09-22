import { useMemo, useState } from "react";
import { ArrowRight, Camera, Check, Clock3, Heart, Images, Lightbulb, MessageCircle, Music2, PenLine, Phone, Plus, Send, Sparkles, X } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { Modal } from "../components/Common";

const contributions = {
  photo: {
    title: "Aggiungi una foto",
    icon: Camera,
    label: "Titolo della foto",
    placeholder: "es. Elena e Paolo a Cefalù",
    help: "Nella demo salviamo titolo e contesto, senza inviare file reali.",
  },
  memory: {
    title: "Racconta un ricordo",
    icon: Heart,
    label: "Titolo del ricordo",
    placeholder: "es. Le domeniche in giardino",
    help: "Il team potrà verificarlo prima che ROSS lo usi in conversazione.",
  },
  topic: {
    title: "Suggerisci un argomento",
    icon: Lightbulb,
    label: "Argomento",
    placeholder: "es. Chiedile della festa di pensionamento",
    help: "ROSS lo proporrà solo in un momento adatto e senza insistere.",
  },
  note: {
    title: "Lascia una nota",
    icon: PenLine,
    label: "Titolo breve",
    placeholder: "es. La chiamo domenica pomeriggio",
    help: "Una nota semplice per mantenere continuità tra famiglia e struttura.",
  },
};

export function FamilyExperience() {
  const { state, actions } = useDemo();
  const [activeForm, setActiveForm] = useState(null);
  const [form, setForm] = useState({ title: "", detail: "" });
  const memory = state.memories.find((item) => item.id === "ross-cefalu-camera");
  const confirmed = memory?.status === "Confermata";
  const conversationDone = Boolean(state.rossJourney.completedAt);
  const recentMemories = state.memories.filter((item) => item.residentId === "elena" && item.status === "Confermata").slice(0, 4);
  const latestContribution = state.familyContributions[0];
  const prompt = confirmed
    ? "Quando la senti, chiedile della piccola macchina fotografica rossa che Paolo portava sul lungomare di Cefalù."
    : "Quando la senti, chiedile della passeggiata sul lungomare di Cefalù e delle fotografie del viaggio del 1998.";
  const story = confirmed
    ? "Oggi Elena ha ascoltato Mina, ha scelto alcune fotografie della Sicilia e ha raccontato a ROSS un dettaglio nuovo: Paolo portava una piccola macchina fotografica rossa. Il ricordo è stato confermato e ora fa parte della sua storia."
    : conversationDone
      ? "Oggi Elena ha ascoltato Mina e ha ripreso il racconto del viaggio in Sicilia. È emerso un nuovo dettaglio su Paolo e una macchina fotografica rossa: la struttura lo sta verificando prima di aggiungerlo alla sua storia."
      : "Oggi Elena ha scelto Mina per iniziare il pomeriggio. Più tardi ha sfogliato fotografie di viaggio e ha ricordato con piacere le passeggiate serali a Cefalù con Paolo.";
  const activityCount = useMemo(() => Math.max(3, state.interactions.filter((item) => item.residentId === "elena" && item.date === "2026-09-21").length), [state.interactions]);

  const openForm = (kind) => {
    setActiveForm(kind);
    setForm({ title: "", detail: "" });
  };

  const saveContribution = (event) => {
    event.preventDefault();
    actions.addFamilyContribution({ kind: activeForm, title: form.title, detail: form.detail, author: "Anna" });
    setActiveForm(null);
  };

  return (
    <div className="family-app screen-enter">
      <header className="family-header">
        <a className="family-brand" href="/famiglia" aria-label="ROSS per la famiglia"><span>R</span><div><strong>ROSS</strong><small>per la famiglia</small></div></a>
        <div className="family-person"><span>AB</span><div><strong>Ciao, Anna</strong><small>Elena · Residenza Aurora</small></div></div>
      </header>

      <main className="family-main">
        <section className="family-intro">
          <span className="family-kicker"><Sparkles size={15} /> LUNEDÌ 21 SETTEMBRE</span>
          <h1>Oggi con Elena</h1>
          <p>ROSS ti racconta qualcosa della quotidianità della persona che ami, anche quando non sei lì.</p>
        </section>

        <section className="family-story">
          <div className="story-ribbon"><span>Il racconto di oggi</span><small>Aggiornato alle 17:18</small></div>
          <h2>{confirmed ? "Una macchina fotografica rossa riapre un ricordo." : conversationDone ? "Un dettaglio nuovo dal viaggio in Sicilia." : "Musica, fotografie e una passeggiata sul mare."}</h2>
          <p>{story}</p>
          <div className="story-moments">
            <div><span className="moment-icon mint"><Music2 /></span><strong>Mina in salotto</strong><small>11:40 · 12 minuti</small></div>
            <div><span className="moment-icon coral"><Images /></span><strong>Fotografie di viaggio</strong><small>15:58 · 14 minuti</small></div>
            <div><span className="moment-icon lilac"><MessageCircle /></span><strong>{conversationDone ? "Cefalù e fotografie" : "Passeggiate a Cefalù"}</strong><small>{conversationDone ? "17:18 · 14 minuti" : "16:20 · 16 minuti"}</small></div>
          </div>
          <div className="family-natural-stats">
            <span><strong>{activityCount}</strong> momenti condivisi oggi</span>
            <span><strong>40 min</strong> insieme a ROSS</span>
            <span><strong>2</strong> ricordi ripresi</span>
          </div>
        </section>

        <section className="family-call-card">
          <div className="call-icon"><Phone /></div>
          <div><span>UN FILO PER LA PROSSIMA CHIAMATA</span><h2>{prompt}</h2><p>È un invito, non una scaletta: lascia che sia Elena a decidere dove portare il racconto.</p></div>
          <button type="button" onClick={() => actions.addFamilyContribution({ kind: "note", title: "Spunto salvato per la chiamata", detail: prompt, author: "Anna" })}><Check size={16} /> Salva lo spunto</button>
        </section>

        <section className="family-grid">
          <article className="family-panel family-memory-panel">
            <header><div><span>UN NUOVO RICORDO</span><h2>{memory?.title || "La spiaggia di Cefalù"}</h2></div><span className={`family-memory-status ${confirmed ? "confirmed" : "pending"}`}>{confirmed ? "Confermato" : conversationDone ? "In verifica" : "Dalla sua storia"}</span></header>
            <p>{memory?.description || "Elena torna spesso alle passeggiate serali vicino al mare, insieme a Paolo."}</p>
            <div className="memory-thread"><span>1998</span><i /><strong>Viaggio in Sicilia</strong><ArrowRight /><strong>Cefalù</strong>{memory && <><ArrowRight /><strong>Fotografia</strong></>}</div>
            <small>{confirmed ? "Il dettaglio è ora disponibile nel profilo, nel grafo e nei report della struttura." : conversationDone ? "ROSS non userà questo dettaglio come fatto finché non sarà confermato." : "Fonte: storia raccontata da Elena e confermata dalla famiglia."}</small>
          </article>

          <article className="family-panel fun-fact">
            <span>UNA COSA CHE FORSE NON SAPEVI</span>
            <h2>Elena collegava Mina ai pomeriggi passati in cucina.</h2>
            <p>È uno dei ricordi che ROSS usa con più naturalezza per iniziare una conversazione.</p>
            <div><Music2 /><span><strong>“Se telefonando”</strong><small>Ascoltata oggi insieme</small></span></div>
          </article>

          <article className="family-panel family-activities">
            <header><div><span>ATTIVITÀ DI OGGI</span><h2>Piccoli momenti scelti per lei</h2></div><Clock3 /></header>
            <ul>
              <li><span>01</span><div><strong>Indovina la canzone</strong><small>Scelta perché Elena ama la musica italiana</small></div><em>10 min</em></li>
              <li><span>02</span><div><strong>Fotografie di viaggio</strong><small>Collega Sofia, Palermo e Cefalù</small></div><em>15 min</em></li>
              <li><span>03</span><div><strong>Conversazione libera</strong><small>Un solo stimolo, con pause lunghe</small></div><em>14 min</em></li>
            </ul>
          </article>

          <article className="family-panel family-recent">
            <span>RICORDI RECENTI</span>
            <h2>La storia continua</h2>
            {recentMemories.map((item) => <div key={item.id}><span>{item.category[0]}</span><div><strong>{item.title}</strong><small>{item.source}</small></div><ArrowRight size={15} /></div>)}
          </article>
        </section>

        <section className="family-contribute">
          <div><span>ANCHE TU FAI PARTE DELLA STORIA</span><h2>Condividi qualcosa con Elena e ROSS</h2><p>Ogni contributo resta distinguibile dalla voce di Elena e viene verificato dalla struttura.</p></div>
          <div className="contribution-actions">
            <button onClick={() => openForm("photo")}><Camera /><span><strong>Aggiungi foto</strong><small>Con un breve contesto</small></span></button>
            <button onClick={() => openForm("memory")}><Heart /><span><strong>Racconta un ricordo</strong><small>Da verificare insieme</small></span></button>
            <button onClick={() => openForm("topic")}><Lightbulb /><span><strong>Suggerisci un tema</strong><small>Per una prossima volta</small></span></button>
            <button onClick={() => openForm("note")}><PenLine /><span><strong>Lascia una nota</strong><small>Alla struttura</small></span></button>
          </div>
          {latestContribution && <div className="family-saved"><Check size={16} /><span><strong>Ultimo contributo salvato</strong>{latestContribution.title}</span></div>}
        </section>
      </main>

      <Modal open={Boolean(activeForm)} title={activeForm ? contributions[activeForm].title : ""} onClose={() => setActiveForm(null)}>
        {activeForm && <form className="family-form" onSubmit={saveContribution}>
          <div className="family-form-icon">{(() => { const Icon = contributions[activeForm].icon; return <Icon />; })()}</div>
          <p>{contributions[activeForm].help}</p>
          <label>{contributions[activeForm].label}<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder={contributions[activeForm].placeholder} /></label>
          <label>Contesto<textarea required value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} placeholder="Scrivi poche righe, con parole semplici…" /></label>
          <div className="modal-actions"><button type="button" className="ghost-button" onClick={() => setActiveForm(null)}><X size={16} /> Annulla</button><button className="primary-button"><Send size={16} /> Salva e condividi</button></div>
        </form>}
      </Modal>
    </div>
  );
}
