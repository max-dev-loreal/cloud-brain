{/*imports */}
import { useSimulation } from '@/features/simulation/hooks'
import { useAIOrchestrator } from '@/features/ai/hooks'
import { NetworkGraph } from '@/widgets/NetworkGraph/ui/NetworkGraph'
import { MetricsPanel } from '@/widgets/MetricsPanel/MetricsPanel'
import { EventsFeed } from '@/widgets/EventsFeed/EventsFeed'
import { AIDecisions } from '@/widgets/AIDecisions/AIDecisions'
import { Button } from '@/shared/ui/Button'
import { Layout } from '@/shared/ui/Layout'
{/* imports-end */}

export default function Dashboard() {
    const{
        nodes,
        edges,
        regions,
        isRunning,
        chaosMode,
        StartTraffic,
        stopTraffic,
        triggerChaos,
        triggerSpike,
        resetSimulation,
    } = useSimulation()


const { isEnabled, toggleAI, lastDecisions } = useAIOrchestrator()

return(
    <Layout>
        {/* ── Top bar ── */}
        <header className="dashboard-header">
        <h1 className="dashboard-title">Cloud Brain</h1>

        <div className="Controls">

            <button
            variant={isRunning ? 'active' : 'default'}
            onClick={isRunning ? stopTraffic : StartTraffic}
            >
               {isRunning ? '⏸ Pause' : '▶ Start traffic'}
            </button>

            <button
            variant={chaosMode ? 'danger' : 'default'}
            onClick={triggerChaos}
            >
             💢 Chaos mode
            </button>

            <button onClick={triggerSpike}>
                📈 10× load
            </button>

            <button
            variant={isEnabled ?  'info' : 'default'}
            onClick={toggleAI}
            >
            🤖 AI {isEnabled ? 'on' : 'off'}
            </button>

            <button variant="ghost" onClick={resetSimulation}>
                Reset
            </button>
        </div>
        </header>   


          {/* ── Main grid ── */}
          <div className="dashboard-grid">
            <section className="graph-area">
                <NetworkGraph
                nodes={nodes}
                edges={edges}
                regions={regions}
                />
            </section>

              {/* ── Right Panel  ── */}
              <aside className="sidebar">
                <MetricsPanel nodes={nodes}/>
                <AIDecisions
                lastDecisions={lastDecisions}
                isEnabled={isEnabled}
                />
              </aside>
          </div>
          /</Layout>
)
}