import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DemoProvider } from "./state/DemoContext";
import { Layout } from "./components/Layout";

const load = (module, name) => lazy(() => module().then((exports) => ({ default: exports[name] })));
const Dashboard = load(() => import("./pages/Dashboard"), "Dashboard");
const Residents = load(() => import("./pages/Residents"), "Residents");
const ResidentProfile = load(() => import("./pages/ResidentProfile"), "ResidentProfile");
const Activities = load(() => import("./pages/Activities"), "Activities");
const LiveInteraction = load(() => import("./pages/LiveInteraction"), "LiveInteraction");
const InteractionsPage = load(() => import("./pages/OperationalPages"), "InteractionsPage");
const HandoverPage = load(() => import("./pages/OperationalPages"), "HandoverPage");
const InsightsPage = load(() => import("./pages/OperationalPages"), "InsightsPage");
const AnalyticsPage = load(() => import("./pages/OperationalPages"), "AnalyticsPage");
const ReportsPage = load(() => import("./pages/OperationalPages"), "ReportsPage");
const SettingsPage = load(() => import("./pages/Settings"), "SettingsPage");
const StructurePage = load(() => import("./pages/Settings"), "StructurePage");

export function App() {
  return <BrowserRouter><DemoProvider><Suspense fallback={<div className="route-loading"><span /><p>ROSS sta preparando il contesto…</p></div>}><Routes><Route element={<Layout />}><Route path="/" element={<Dashboard />} /><Route path="/ospiti" element={<Residents />} /><Route path="/ospiti/:id" element={<ResidentProfile />} /><Route path="/attivita" element={<Activities />} /><Route path="/interazioni" element={<InteractionsPage />} /><Route path="/consegne" element={<HandoverPage />} /><Route path="/insight" element={<InsightsPage />} /><Route path="/analytics" element={<AnalyticsPage />} /><Route path="/report" element={<ReportsPage />} /><Route path="/struttura" element={<StructurePage />} /><Route path="/impostazioni" element={<SettingsPage />} /></Route><Route path="/interazione/:id" element={<LiveInteraction />} /></Routes></Suspense></DemoProvider></BrowserRouter>;
}
