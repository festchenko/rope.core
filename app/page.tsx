import React from 'react'
import TopBar from './components/TopBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      
      <main className="p-4">
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-2xl font-labco font-semibold text-fg mb-2">
              rope.core
            </h1>
            <p className="text-muted font-inter">
              Digital Twin Interface
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
