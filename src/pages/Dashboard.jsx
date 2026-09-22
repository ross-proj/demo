import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Clock3, MemoryStick, MessageCircle, Sparkles, Users } from "lucide-react";
import { dayTimeline, insights, residents } from "../data/demoData";
import { useDemo } from "../state/DemoContext";
import { Avatar, InfoTip, Metric, ModeBadge } from "../components/Common";

export function Dashboard() {
  const { state, actions } = useDemo();
  const navigate = useNavigate();
  const today = state.interactions.filter((i) => i.date === "2026-09-21");
  const minutes = today.reduce((sum, item) => sum + item.duration, 0);
  const observed = insights[0];
  const activeResidents = state.residents.filter((r) => r.status !== "Riposo").length;
  const completedActivities = today.filter((i) => i.type !== "Conversazione").length;
  const recentMemories = state.memories.filter((m) => m.status === "Da verificare" || m.status === "Suggerita").length;
  const topResidents = useMemo(() => state.residents.slice(0, 6), [state.residents]);

  return (
    <div className="dashboard-screen screen-enter">
      <section className="hero-heading">
        <div><h1>Una giornata che conta,<br />insieme.</h1><p>ROSS rende leggibili interazioni, ricordi e piccoli cambiamenti nel ritmo unico di ogni persona.</p></div>
        <blockquote>“Piccoli segnali,<br />grandi connessioni.”<small>R.O.S.S.</small></blockquote>
      </section>
      {state.rossJourney.completedAt && <section className="cross-view-update">
        <span><Sparkles /></span>
        <div><small>AGGIORNAMENTO DA ROSS · ELENA</small><strong>{state.rossJourney.confirmedAt ? "Il nuovo ricordo è stato confermato e collegato alla storia." : "È emerso un nuovo ricordo durante la conversazione su Cefalù."}</strong><p>{state.rossJourney.confirmedAt ? "Profilo, grafo, report e vista famiglia sono già aggiornati." : "La macchina fotografica rossa di Paolo è pronta per la verifica."}</p></div>
        <button className="primary-button" onClick={() => navigate("/ospiti/elena?tab=memorie")}>{state.rossJourney.confirmedAt ? "Apri il profilo" : "Verifica memoria"}<ArrowRight size={16} /></button>
      </section>}
      <section className="metrics-strip">
        <Metric icon={Users} value={activeResidents} label="ospiti attivi" detail="su 8 ospiti" tone="mint" tip="Ospiti con almeno una interazione o attività registrata oggi." />
        <Metric icon={MessageCircle} value={today.length} label="interazioni oggi" detail="+2 rispetto a ieri" tone="coral" />
        <Metric icon={Clock3} value={`${minutes} min`} label="tempo insieme" detail="media 14 min" tone="sand" />
        <Metric icon={Activity} value={completedActivities} label="attività completate" detail="3 di gruppo" tone="lilac" />
        <Metric icon={MemoryStick} value={recentMemories} label="ricordi emersi" detail="da verificare" tone="mint" />
      </section>
      <section className="dashboard-grid">
        <div className="day-panel surface">
          <div className="panel-heading"><div><h2>Oggi in Residenza Aurora</h2><p>Attività, interazioni e momenti di quiete, nel loro ritmo naturale.</p></div><button className="text-button" onClick={() => navigate("/interazioni")}>Agenda completa <ArrowRight size={15} /></button></div>
          <div className="time-axis"><span>07:00</span><span>10:00</span><span>13:00</span><span>16:00</span><span>19:00</span><span>22:00</span></div>
          <div className="timeline-track">
            {dayTimeline.map((item) => <button key={`${item.time}-${item.title}`} className={`timeline-block block-${item.type}`} style={{ flex: item.width }} title={`${item.time} · ${item.title}`}><strong>{item.title}</strong><small>{item.time}</small></button>)}
          </div>
          <div className="timeline-legend"><span><i className="legend-interaction" />Interazione</span><span><i className="legend-activity" />Attività</span><span><i className="legend-quiet" />Quiete / routine</span></div>
          <div className="resident-rows">
            <div className="subheading"><h3>Persone in evidenza</h3><span>Rispetto alla propria baseline</span></div>
            {topResidents.map((resident) => (
              <button key={resident.id} className="resident-row" onClick={() => navigate(`/ospiti/${resident.id}`)}>
                <Avatar resident={resident} />
                <div className="resident-main"><strong>{resident.name}</strong><small>Stanza {resident.room} · {resident.current}</small></div>
                {resident.participation == null ? <span className="baseline-building">Baseline in costruzione</span> : <span className={`delta ${resident.delta >= 0 ? "positive" : "negative"}`}>{resident.delta >= 0 ? "+" : ""}{resident.delta.toFixed(1)}</span>}
                <ModeBadge mode={resident.mode} />
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <aside className="noticed-panel surface">
          <div className="panel-heading"><div><h2>ROSS ha notato <InfoTip label="Perché lo vedo?" text="ROSS mostra ricorrenze osservabili nelle proprie interazioni e le confronta con la baseline personale." /></h2><p>Contesto utile, non valutazioni cliniche.</p></div></div>
          <article className="featured-insight">
            <div className="insight-meta"><span>{observed.category}</span><small>{observed.period}</small></div>
            <h3>{observed.title}</h3><p>{observed.body}</p>
            <div className="evidence-row">{observed.evidence.map((e) => <span key={e}>{e}</span>)}</div>
            <div className="insight-actions"><button className="primary-button" onClick={() => navigate("/ospiti/elena")}>Apri Elena <ArrowRight size={16} /></button><button className="ghost-button" onClick={() => actions.takeInsight(observed.id)}>{state.takenInsights.includes(observed.id) ? "Preso in carico" : "Prendi in carico"}</button></div>
          </article>
          <div className="mini-insights">
            {insights.slice(1, 4).map((item) => <button key={item.id} onClick={() => navigate("/insight")}><span className={`insight-dot tone-${item.tone}`} /><div><small>{item.category}</small><strong>{item.title}</strong></div><ArrowRight size={15} /></button>)}
          </div>
          <div className="local-note"><span className="leaf-mark">R</span><div><strong>Elaborazione locale</strong><p>Le informazioni personali restano nel sistema ROSS della struttura.</p></div></div>
        </aside>
      </section>
    </div>
  );
}
