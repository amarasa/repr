/**
 * Mock Data Management System
 * Simulates Supabase data with localStorage persistence
 * This will be replaced with real Supabase queries later
 */

export interface Exercise {
  id: string
  day_id: string
  exercise_library_id?: string
  name: string
  sets: number
  reps: number
  weight: number
  notes: string
  position: number
  completed?: boolean
}

export interface DayProgram {
  dayName: string
  dayNumber: number
  isRestDay: boolean
  exercises: Exercise[]
}

export interface WeeklyProgram {
  id: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
  days: DayProgram[]
}

export interface WorkoutSession {
  id: string
  day_name: string
  date: string
  exercises: Exercise[]
  mood: number
  notes: string
  completed: boolean
  duration_minutes?: number
}

/**
 * Get current day name
 */
export function getCurrentDayName(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

/**
 * Check if user has set up a weekly program
 */
export function hasWeeklyProgram(): boolean {
  if (typeof window === 'undefined') return false
  const program = localStorage.getItem('weeklyProgram')
  return program !== null
}

/**
 * Get the user's weekly program
 */
export function getWeeklyProgram(): WeeklyProgram | null {
  if (typeof window === 'undefined') return null
  const program = localStorage.getItem('weeklyProgram')
  return program ? JSON.parse(program) : null
}

/**
 * Save the user's weekly program
 */
export function saveWeeklyProgram(program: DayProgram[]): void {
  if (typeof window === 'undefined') return
  
  const weeklyProgram: WeeklyProgram = {
    id: 'weekly-program-1',
    user_id: 'user-1',
    name: 'My Weekly Program',
    is_active: true,
    created_at: new Date().toISOString(),
    days: program
  }
  
  localStorage.setItem('weeklyProgram', JSON.stringify(weeklyProgram))
}

/**
 * Get today's workout program
 */
export function getTodaysWorkout(): DayProgram | null {
  const program = getWeeklyProgram()
  if (!program) return null
  
  const today = getCurrentDayName()
  return program.days.find(day => 
    day.dayName.toLowerCase() === today
  ) || null
}

/**
 * Get workout program for a specific day
 */
export function getDayWorkout(dayName: string): DayProgram | null {
  const program = getWeeklyProgram()
  if (!program) return null
  
  return program.days.find(day => 
    day.dayName.toLowerCase() === dayName.toLowerCase()
  ) || null
}

/**
 * Get workout history (mock data for now)
 */
export function getWorkoutHistory(): WorkoutSession[] {
  if (typeof window === 'undefined') return []
  const history = localStorage.getItem('workoutHistory')
  return history ? JSON.parse(history) : []
}

/**
 * Save a completed workout session
 */
export function saveWorkoutSession(session: Omit<WorkoutSession, 'id'>): void {
  if (typeof window === 'undefined') return
  
  const workoutSession: WorkoutSession = {
    ...session,
    id: `session-${Date.now()}`
  }
  
  const history = getWorkoutHistory()
  history.unshift(workoutSession) // Add to beginning
  
  // Keep only last 30 sessions
  const limitedHistory = history.slice(0, 30)
  localStorage.setItem('workoutHistory', JSON.stringify(limitedHistory))
}

/**
 * Get weekly progress stats
 */
export function getWeeklyStats() {
  const program = getWeeklyProgram()
  const history = getWorkoutHistory()
  
  if (!program) {
    return {
      totalWorkoutDays: 0,
      completedDays: 0,
      restDays: 0,
      currentWeekCompleted: 0
    }
  }
  
  const totalWorkoutDays = program.days.filter(day => !day.isRestDay).length
  const restDays = program.days.filter(day => day.isRestDay).length
  
  // Get this week's completed workouts
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  
  const currentWeekCompleted = history.filter(session => {
    const sessionDate = new Date(session.date)
    return sessionDate >= startOfWeek && session.completed
  }).length
  
  return {
    totalWorkoutDays,
    completedDays: currentWeekCompleted,
    restDays,
    currentWeekCompleted
  }
}

/**
 * Clear all data (for testing)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('weeklyProgram')
  localStorage.removeItem('workoutHistory')
} 