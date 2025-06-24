import { createClient } from '@supabase/supabase-js'

// Provide fallback values for build time when environment variables aren't available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (based on the schema in the spec)
export interface Week {
  id: string
  user_id: string
  start_date: string
  created_at: string
}

export interface Day {
  id: string
  week_id: string
  day_of_week: number // 1=Monday
  is_rest_day: boolean
}

export interface Exercise {
  id: string
  day_id: string
  exercise_library_id?: string // Reference to canned exercise
  name: string
  sets: number
  reps: number
  weight: number
  notes?: string
  mood?: number
  position: number
}

export interface ExerciseLibrary {
  id: string
  name: string
  category: string
  muscle_groups: string[]
  instructions?: string
  created_at: string
}

export interface CompletedWorkout {
  id: string
  day_id: string
  completed_at: string
} 