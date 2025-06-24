'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material'
import { Calendar, Save, Trash2, ArrowLeft } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ExerciseSelector } from '@/components/ExerciseSelector'
import { ExerciseLibrary } from '@/lib/supabase'
import { saveWeeklyProgram, getWeeklyProgram, DayProgram, Exercise } from '@/lib/mockData'

// List of bodyweight exercises that use bodyweight + accessory weight
const BODYWEIGHT_EXERCISES = [
  'pull-ups',
  'pullups', 
  'pull ups',
  'chin-ups',
  'chinups',
  'chin ups',
  'dips',
  'push-ups',
  'pushups',
  'push ups',
  'muscle-ups',
  'muscleups',
  'muscle ups',
  'bodyweight squats',
  'pistol squats'
]

const isBodyweightExercise = (exerciseName: string): boolean => {
  return BODYWEIGHT_EXERCISES.some(bwe => 
    exerciseName.toLowerCase().includes(bwe.toLowerCase())
  )
}

/**
 * Weekly Program Builder
 * Allows users to create and edit their 7-day weekly workout template
 */
export default function WeeklyProgramPage() {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [weekProgram, setWeekProgram] = useState<DayProgram[]>([
    { dayName: 'Monday', dayNumber: 1, isRestDay: false, exercises: [] },
    { dayName: 'Tuesday', dayNumber: 2, isRestDay: true, exercises: [] },
    { dayName: 'Wednesday', dayNumber: 3, isRestDay: false, exercises: [] },
    { dayName: 'Thursday', dayNumber: 4, isRestDay: false, exercises: [] },
    { dayName: 'Friday', dayNumber: 5, isRestDay: false, exercises: [] },
    { dayName: 'Saturday', dayNumber: 6, isRestDay: true, exercises: [] },
    { dayName: 'Sunday', dayNumber: 7, isRestDay: true, exercises: [] },
  ])

  // Use a ref to track exercise counter for stable IDs
  const exerciseCounterRef = useRef(0)

  // Load existing program on component mount
  useEffect(() => {
    const existingProgram = getWeeklyProgram()
    if (existingProgram) {
      setWeekProgram(existingProgram.days)
      // Update counter to prevent ID conflicts
      const maxId = existingProgram.days.reduce((max, day) => {
        const dayMax = day.exercises.reduce((exerciseMax, exercise) => {
          const idNum = parseInt(exercise.id.split('-')[1] || '0')
          return Math.max(exerciseMax, idNum)
        }, 0)
        return Math.max(max, dayMax)
      }, 0)
      exerciseCounterRef.current = maxId
    }
  }, [])

  const toggleRestDay = (dayIndex: number) => {
    setWeekProgram(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, isRestDay: !day.isRestDay, exercises: !day.isRestDay ? [] : day.exercises }
        : day
    ))
  }

  const addExercise = (dayIndex: number, exerciseSelection: ExerciseLibrary | string) => {
    exerciseCounterRef.current += 1
    const newExercise: Exercise = {
      id: `exercise-${exerciseCounterRef.current}`,
      day_id: `day-${dayIndex}`,
      exercise_library_id: typeof exerciseSelection === 'object' ? exerciseSelection.id : undefined,
      name: typeof exerciseSelection === 'object' ? exerciseSelection.name : exerciseSelection,
      sets: 3,
      reps: 10,
      weight: 0,
      notes: '',
      position: weekProgram[dayIndex].exercises.length
    }

    setWeekProgram(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, exercises: [...day.exercises, newExercise] }
        : day
    ))
  }

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    setWeekProgram(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            exercises: day.exercises.filter((_, eIndex) => eIndex !== exerciseIndex)
          }
        : day
    ))
  }

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string | number | boolean) => {
    setWeekProgram(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? {
            ...day,
            exercises: day.exercises.map((exercise, eIndex) => 
              eIndex === exerciseIndex 
                ? { ...exercise, [field]: value }
                : exercise
            )
          }
        : day
    ))
  }

  const handleSaveProgram = () => {
    saveWeeklyProgram(weekProgram)
    setShowSaveSuccess(true)
  }

  const totalExercises = weekProgram.reduce((total, day) => total + day.exercises.length, 0)
  const workoutDays = weekProgram.filter(day => !day.isRestDay).length

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center">
            <IconButton href="/" sx={{ mr: 2 }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Weekly Program Builder
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Design your 7-day workout template • {workoutDays} workout days • {totalExercises} total exercises
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSaveProgram}
            >
              Save Program
            </Button>
          </Box>
        </Box>

        {/* Save Success Alert */}
        {totalExercises === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              👋 Getting Started
            </Typography>
            <Typography variant="body2">
              Add exercises to each workout day using the exercise selector. 
              You can toggle days as rest days, set target sets/reps/weight, and add notes.
            </Typography>
          </Alert>
        )}

        {/* Weekly Overview */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {weekProgram.map((day, dayIndex) => (
            <Card key={day.dayNumber}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Calendar size={20} />
                    <Typography variant="h6" fontWeight={500}>
                      {day.dayName}
                    </Typography>
                    {day.isRestDay && (
                      <Chip label="Rest Day" color="secondary" size="small" />
                    )}
                    {!day.isRestDay && day.exercises.length > 0 && (
                      <Chip label={`${day.exercises.length} exercises`} color="primary" size="small" />
                    )}
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={day.isRestDay}
                        onChange={() => toggleRestDay(dayIndex)}
                      />
                    }
                    label="Rest Day"
                  />
                </Box>

                {!day.isRestDay && (
                  <>
                    {/* Exercise List */}
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <Card key={exercise.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            mb: 2,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}>
                            <Typography variant="subtitle2" sx={{ minWidth: 200, flex: 1 }}>
                              {exercise.name}
                            </Typography>
                            <TextField
                              label="Sets"
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                              size="small"
                              sx={{ width: 80 }}
                            />
                            <TextField
                              label="Reps"
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'reps', parseInt(e.target.value))}
                              size="small"
                              sx={{ width: 80 }}
                            />
                            {isBodyweightExercise(exercise.name) ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                                <TextField
                                  label="Bodyweight"
                                  type="number"
                                  value={Math.max(0, exercise.weight - 0)} // Start with no accessory weight
                                  onChange={(e) => {
                                    const bodyweight = parseInt(e.target.value) || 0
                                    updateExercise(dayIndex, exerciseIndex, 'weight', bodyweight)
                                  }}
                                  size="small"
                                />
                                <TextField
                                  label="+ Accessory"
                                  type="number"
                                  value={0} // Default to no accessory weight
                                  onChange={(e) => {
                                    const accessory = parseInt(e.target.value) || 0
                                    const bodyweight = Math.max(0, exercise.weight)
                                    updateExercise(dayIndex, exerciseIndex, 'weight', bodyweight + accessory)
                                  }}
                                  size="small"
                                />
                              </Box>
                            ) : (
                              <TextField
                                label="Weight (lbs)"
                                type="number"
                                value={exercise.weight}
                                onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'weight', parseInt(e.target.value))}
                                size="small"
                                sx={{ width: 100 }}
                              />
                            )}
                            <TextField
                              placeholder="Notes"
                              value={exercise.notes}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'notes', e.target.value)}
                              size="small"
                              sx={{ minWidth: 150, flex: 1 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeExercise(dayIndex, exerciseIndex)}
                              color="error"
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Add Exercise */}
                    <Box sx={{ mt: 2 }}>
                      <ExerciseSelector
                        onSelect={(exerciseSelection) => addExercise(dayIndex, exerciseSelection)}
                        placeholder="Add an exercise..."
                      />
                    </Box>

                    {day.exercises.length === 0 && (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No exercises added yet. Use the selector above to add exercises.
                      </Typography>
                    )}
                  </>
                )}

                {day.isRestDay && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                    🛌 Rest day - Recovery is important for progress!
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Save Success Snackbar */}
        <Snackbar
          open={showSaveSuccess}
          autoHideDuration={4000}
          onClose={() => setShowSaveSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSaveSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            <Typography variant="body2">
              ✅ Weekly program saved! Return to dashboard to start your workouts.
            </Typography>
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  )
} 