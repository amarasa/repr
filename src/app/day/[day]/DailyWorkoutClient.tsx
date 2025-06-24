'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Slider,
  Chip,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material'
import { ArrowLeft, Check, Plus, Edit3, Calendar } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { getDayWorkout, saveWorkoutSession, Exercise } from '@/lib/mockData'

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
 * Daily Workout Client Component
 * Contains all interactive functionality for logging workouts
 */
export function DailyWorkoutClient() {
  const params = useParams()
  const router = useRouter()
  const dayName = params.day as string
  
  const [mood, setMood] = useState(3)
  const [isCompleted, setIsCompleted] = useState(false)
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [dayProgram, setDayProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load exercises from weekly program
    const program = getDayWorkout(dayName)
    setDayProgram(program)
    
    if (program && !program.isRestDay) {
      // Create copies of exercises with completion status
      const exercisesWithCompletion = program.exercises.map((exercise: Exercise) => ({
        ...exercise,
        completed: false
      }))
      setExercises(exercisesWithCompletion)
    }
    
    setLoading(false)
  }, [dayName])

  const updateExercise = (exerciseIndex: number, field: keyof Exercise, value: any) => {
    setExercises(prev => prev.map((exercise, eIndex) => 
      eIndex === exerciseIndex
        ? { ...exercise, [field]: value }
        : exercise
    ))
  }

  const toggleExerciseCompletion = (exerciseIndex: number) => {
    updateExercise(exerciseIndex, 'completed', !exercises[exerciseIndex].completed)
  }

  const completeWorkout = () => {
    setIsCompleted(true)
    
    // Save workout session to history
    saveWorkoutSession({
      day_name: dayName,
      date: new Date().toISOString(),
      exercises: exercises,
      mood: mood,
      notes: workoutNotes,
      completed: true,
      duration_minutes: undefined // Could add timer later
    })

    // After a short delay, redirect to dashboard
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading workout...</Typography>
        </Box>
      </AppLayout>
    )
  }

  // No program set up
  if (!dayProgram) {
    return (
      <AppLayout>
        <Box>
          <Box display="flex" alignItems="center" mb={4}>
            <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h4" fontWeight={600}>
              {dayName.charAt(0).toUpperCase() + dayName.slice(1)} Workout
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              No Weekly Program Found
            </Typography>
            <Typography variant="body2" mb={2}>
              You need to set up your weekly program first before logging daily workouts.
            </Typography>
            <Button variant="contained" href="/week/edit" size="small">
              Create Weekly Program
            </Button>
          </Alert>
        </Box>
      </AppLayout>
    )
  }

  // Rest day
  if (dayProgram.isRestDay) {
    return (
      <AppLayout>
        <Box>
          <Box display="flex" alignItems="center" mb={4}>
            <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h4" fontWeight={600}>
              {dayName.charAt(0).toUpperCase() + dayName.slice(1)} - Rest Day
            </Typography>
          </Box>

          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🛌 Rest Day
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Recovery is just as important as training. Take some time to relax and let your muscles rebuild.
              </Typography>
              <Button variant="outlined" href="/">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Box>
      </AppLayout>
    )
  }

  const totalExercises = exercises.length
  const completedExercises = exercises.filter(ex => ex.completed).length
  const moodEmojis = ['😫', '😕', '😐', '😊', '🔥']
  const moodLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing']

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowLeft size={20} />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              {dayName.charAt(0).toUpperCase() + dayName.slice(1)} Workout
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1" color="text.secondary">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short', 
                  day: 'numeric'
                })}
              </Typography>
              {isCompleted ? (
                <Chip label="Completed" color="success" icon={<Check size={14} />} />
              ) : (
                <Chip label={`${completedExercises}/${totalExercises} exercises`} color="primary" />
              )}
            </Box>
          </Box>
        </Box>

        {/* Mood Tracker */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How are you feeling today?
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {moodEmojis[mood - 1]} {moodLabels[mood - 1]}
              </Typography>
              <Slider
                value={mood}
                onChange={(_, newValue) => setMood(newValue as number)}
                min={1}
                max={5}
                step={1}
                marks
                sx={{ flex: 1, maxWidth: 300 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Exercises */}
        {exercises.length > 0 ? (
          exercises.map((exercise, exerciseIndex) => (
            <Card key={exercise.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exercise.completed}
                        onChange={() => toggleExerciseCompletion(exerciseIndex)}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={500}
                    sx={{ 
                      textDecoration: exercise.completed ? 'line-through' : 'none',
                      opacity: exercise.completed ? 0.7 : 1,
                      flex: 1
                    }}
                  >
                    {exercise.name}
                  </Typography>
                  <IconButton size="small">
                    <Edit3 size={16} />
                  </IconButton>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <TextField
                    label="Sets"
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(exerciseIndex, 'sets', parseInt(e.target.value))}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <TextField
                    label="Reps"
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(exerciseIndex, 'reps', parseInt(e.target.value))}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  {isBodyweightExercise(exercise.name) ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                      <TextField
                        label="Bodyweight"
                        type="number"
                        value={Math.max(0, exercise.weight - 25)} // Assume 25 lbs accessory as default
                        onChange={(e) => {
                          const bodyweight = parseInt(e.target.value) || 0
                          // Keep the accessory weight from current total
                          const accessory = Math.max(0, exercise.weight - Math.max(0, exercise.weight - 25))
                          updateExercise(exerciseIndex, 'weight', bodyweight + accessory)
                        }}
                        size="small"
                      />
                      <TextField
                        label="+ Accessory"
                        type="number"
                        value={Math.max(0, exercise.weight - Math.max(0, exercise.weight - 25))}
                        onChange={(e) => {
                          const accessory = parseInt(e.target.value) || 0
                          const bodyweight = Math.max(0, exercise.weight - Math.max(0, exercise.weight - 25))
                          updateExercise(exerciseIndex, 'weight', bodyweight + accessory)
                        }}
                        size="small"
                      />
                    </Box>
                  ) : (
                    <TextField
                      label="Weight"
                      type="number"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(exerciseIndex, 'weight', parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  )}
                  <TextField
                    placeholder="Notes"
                    value={exercise.notes}
                    onChange={(e) => updateExercise(exerciseIndex, 'notes', e.target.value)}
                    size="small"
                    sx={{ minWidth: 200, flex: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No exercises planned for {dayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Add exercises to your weekly program for this day
              </Typography>
              <Button
                variant="contained"
                href="/week/edit"
                startIcon={<Calendar size={16} />}
              >
                Edit Weekly Program
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Workout Notes */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workout Notes
            </Typography>
            <TextField
              multiline
              rows={3}
              placeholder="How did the workout go? Any observations or adjustments for next time?"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              fullWidth
            />
          </CardContent>
        </Card>

        {/* Complete Workout Button */}
        {!isCompleted && exercises.length > 0 && (
          <Box display="flex" justifyContent="center" mb={4}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Check size={20} />}
              onClick={completeWorkout}
              disabled={completedExercises === 0}
              sx={{ px: 4, py: 1.5 }}
            >
              Complete Workout
            </Button>
          </Box>
        )}

        {isCompleted && (
          <Card sx={{ mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                🎉 Workout Completed!
              </Typography>
              <Typography variant="body2" mb={2}>
                Great job finishing your {dayName} workout. Keep up the momentum!
              </Typography>
              <Typography variant="body2" color="success.dark">
                Redirecting to dashboard...
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </AppLayout>
  )
} 