import { DailyWorkoutClient } from './DailyWorkoutClient'

/**
 * Generate static params for all days of the week
 * Required for static export with dynamic routes
 */
export function generateStaticParams() {
  return [
    { day: 'monday' },
    { day: 'tuesday' },
    { day: 'wednesday' },
    { day: 'thursday' },
    { day: 'friday' },
    { day: 'saturday' },
    { day: 'sunday' },
  ]
}

/**
 * Daily Workout Page (Server Component)
 * Renders the client component for interactive functionality
 */
export default function DailyWorkoutPage() {
  return <DailyWorkoutClient />
} 