import { JourneyBuilder } from "./components/JourneyBuilder";
import { fetchActionBlueprintGraph } from "./lib/api";

export default async function Home() {
  const graph = await fetchActionBlueprintGraph();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#cffafe,transparent_32rem),linear-gradient(135deg,#f8fafc,#eef2ff)] px-4 py-8 text-slate-950 md:px-8">
      <JourneyBuilder graph={graph} />
    </div>
  );
}
