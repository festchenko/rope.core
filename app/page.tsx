import React from 'react'
import { 
  Battery, 
  Droplets, 
  Shield, 
  Anchor, 
  Cloud, 
  AlertTriangle 
} from 'lucide-react'
import TopBar from './components/TopBar'
import SectionCard from './components/SectionCard'
import BottomNav from './components/BottomNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      
      <main className="p-4 pb-24">
        <div className="space-y-4">
          {/* Energy / Battery */}
          <SectionCard
            title="Energy / Battery"
            icon={<Battery className="w-full h-full" />}
          >
            <div className="text-sm text-muted">
              {/* TODO: data binding step-1 */}
              to be added
            </div>
          </SectionCard>

          {/* Tanks & Bilge */}
          <SectionCard
            title="Tanks & Bilge"
            icon={<Droplets className="w-full h-full" />}
          >
            <div className="text-sm text-muted">
              {/* TODO: data binding step-1 */}
              to be added
            </div>
          </SectionCard>

          {/* Security & Access */}
          <SectionCard
            title="Security & Access"
            icon={<Shield className="w-full h-full" />}
          >
            <div className="text-sm text-muted">
              {/* TODO: data binding step-1 */}
              to be added
            </div>
          </SectionCard>

          {/* Position & Anchor */}
          <SectionCard
            title="Position & Anchor"
            icon={<Anchor className="w-full h-full" />}
          >
            <div className="text-sm text-muted">
              {/* TODO: data binding step-1 */}
              to be added
            </div>
          </SectionCard>

          {/* Environment */}
          <SectionCard
            title="Environment"
            icon={<Cloud className="w-full h-full" />}
          >
            <div className="text-sm text-muted">
              {/* TODO: data binding step-1 */}
              to be added
            </div>
          </SectionCard>

          {/* Alerts */}
          <SectionCard
            title="Alerts"
            icon={<AlertTriangle className="w-full h-full" />}
          >
            <div className="text-sm text-muted">
              {/* TODO: data binding step-1 */}
              to be added
            </div>
          </SectionCard>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
