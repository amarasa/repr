import { WorkoutDetailClient } from './WorkoutDetailClient'

/**
 * Generate static params for workout detail pages
 * Since session IDs are dynamically generated, we'll create some fallbacks
 * and handle missing sessions client-side
 */
export function generateStaticParams() {
  // Generate some sample session IDs for static export
  // In a real app, these might be recent sessions from a database
  const fallbackSessions = [
    'session-placeholder-1',
    'session-placeholder-2', 
    'session-placeholder-3',
    'session-placeholder-4',
    'session-placeholder-5',
    // Add the specific session ID from the error and other timestamp patterns
    'session-1750727290344',
    'session-1750727290345',
    'session-1750727290346',
    'session-1750727290347',
    'session-1750727290348',
  ]
  
  return fallbackSessions.map(sessionId => ({
    sessionId: sessionId
  }))
}

/**
 * Workout Detail Page (Server Component)
 * Shows detailed stats and edit capabilities for a completed workout
 */
export default function WorkoutDetailPage() {
  return <WorkoutDetailClient />
} 