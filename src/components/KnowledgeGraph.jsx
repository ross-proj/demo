import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Filter, Focus, Minus, Plus, X } from "lucide-react";
import { graphData } from "../data/demoData";

const colors = { residente: "#0c554d", persona: "#ef7857", luogo: "#e4aa42", interesse: "#56b99c", musica: "#9b83ba", evento: "#e7a38d", memoria: "#d76b48" };
const positions = { Elena: [0, 0], Sofia: [-150, -80], Paolo: [130, -95], Anna: [150, 100], Palermo: [250, -35], "Cefalù": [245, 95], Fotografia: [-145, 105], Mina: [-20, -145], "Viaggio 1998": [125, 10], Giardinaggio: [-240, 20], "Fotocamera rossa": [45, 145] };

export function KnowledgeGraph({ addedMemory }) {
  const graphRef = useRef();
  const [selected, setSelected] = useState(null);
  const [hidden, setHidden] = useState([]);
  const data = useMemo(() => {
    const nodes = [...graphData.nodes];
    const links = [...graphData.links];
    if (addedMemory) { nodes.push({ id: "Fotocamera rossa", group: "memoria", size: 7, detail: "Nuova memoria confermata durante la conversazione con ROSS" }); links.push({ source: "Elena", target: "Fotocamera rossa" }, { source: "Fotocamera rossa", target: "Paolo" }, { source: "Fotocamera rossa", target: "Cefalù" }, { source: "Fotocamera rossa", target: "Fotografia" }); }
    const visibleNodes = nodes.filter((n) => !hidden.includes(n.group)).map((n) => ({ ...n, fx: positions[n.id]?.[0], fy: positions[n.id]?.[1] }));
    const ids = new Set(visibleNodes.map((n) => n.id));
    return { nodes: visibleNodes, links: links.filter((l) => ids.has(typeof l.source === "object" ? l.source.id : l.source) && ids.has(typeof l.target === "object" ? l.target.id : l.target)) };
  }, [hidden, addedMemory]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      graphRef.current?.centerAt(0, 0, 300);
      graphRef.current?.zoom(.72, 300);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [data]);

  const toggle = (group) => setHidden((current) => current.includes(group) ? current.filter((g) => g !== group) : [...current, group]);
  return <div className="graph-shell surface">
    <div className="graph-toolbar"><div><Filter size={16} />{Object.keys(colors).map((group) => <button key={group} className={hidden.includes(group) ? "muted" : ""} onClick={() => toggle(group)}><i style={{ background: colors[group] }} />{group}</button>)}</div><div><button title="Zoom avanti" onClick={() => graphRef.current?.zoom((graphRef.current.zoom() || 1) * 1.25, 300)}><Plus size={16} /></button><button title="Zoom indietro" onClick={() => graphRef.current?.zoom((graphRef.current.zoom() || 1) / 1.25, 300)}><Minus size={16} /></button><button title="Centra" onClick={() => graphRef.current?.zoomToFit(500, 60)}><Focus size={16} /></button></div></div>
    <div className="graph-canvas"><ForceGraph2D ref={graphRef} graphData={data} width={760} height={470} backgroundColor="transparent" nodeRelSize={4} nodeVal={(n) => n.size} nodeColor={(n) => colors[n.group]} linkColor={() => "rgba(24,45,42,.24)"} linkWidth={(l) => selected && (l.source.id === selected.id || l.target.id === selected.id) ? 3 : 1.35} warmupTicks={1} cooldownTicks={1} onNodeClick={(node) => setSelected(node)} nodeCanvasObjectMode={() => "after"} nodeCanvasObject={(node, ctx) => { ctx.font = `${node.id === "Elena" ? 600 : 500} 12px Inter, sans-serif`; ctx.fillStyle = "#17342f"; ctx.textAlign = "center"; ctx.fillText(node.id, node.x, node.y + Math.sqrt(node.size || 6) * 4 + 12); }} /></div>
    {selected && <aside className="graph-detail"><button onClick={() => setSelected(null)}><X size={16} /></button><span style={{ color: colors[selected.group] }}>{selected.group}</span><h3>{selected.id}</h3><p>{selected.detail}</p><dl><div><dt>Menzioni</dt><dd>{selected.id === "Sofia" ? 14 : selected.size + 2}</dd></div><div><dt>Memorie collegate</dt><dd>{Math.max(2, selected.size - 3)}</dd></div></dl><button className="primary-button">Apri collegamenti</button></aside>}
  </div>;
}
