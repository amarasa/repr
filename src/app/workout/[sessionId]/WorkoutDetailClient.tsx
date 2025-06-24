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
  Chip,
  IconButton,
  Alert,
  Slider,
} from '@mui/material'
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  Trophy, 
  TrendingUp, 
  Weight,
  Repeat
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { 
  getWorkoutHistory, 
  Exercise, 
  WorkoutSession 
} from '@/lib/mockData'

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

interface ExerciseStats {
  exercise: Exercise
  totalWeight: number
  isPR: boolean
  previousBest: number
  recommendedIncrease?: number
  plateauWeeks?: number
}

export function WorkoutDetailClient() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null)
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedExercises, setEditedExercises] = useState<Exercise[]>([])
  const [editedMood, setEditedMood] = useState(3)
  const [editedNotes, setEditedNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [accessoryWeights, setAccessoryWeights] = useState<{[exerciseId: string]: number}>({})
  const [bodyweights, setBodyweights] = useState<{[exerciseId: string]: number}>({})

  useEffect(() => {
    // Find the workout session
    const history = getWorkoutHistory()
    const session = history.find(s => s.id === sessionId)
    
    if (session) {
      setWorkoutSession(session)
      setEditedExercises([...session.exercises])
      setEditedMood(session.mood)
      setEditedNotes(session.notes)
      
      // Initialize bodyweight and accessory weight states for bodyweight exercises
      const initialBodyweights: {[exerciseId: string]: number} = {}
      const initialAccessoryWeights: {[exerciseId: string]: number} = {}
      
      session.exercises.forEach(exercise => {
        if (isBodyweightExercise(exercise.name)) {
          // For existing exercises, assume a reasonable bodyweight (e.g., 180 lbs) 
          // and calculate accessory weight as the difference
          const defaultBodyweight = 180
          const totalWeight = exercise.weight
          const accessoryWeight = Math.max(0, totalWeight - defaultBodyweight)
          const bodyweight = totalWeight - accessoryWeight
          
          initialBodyweights[exercise.id] = bodyweight
          initialAccessoryWeights[exercise.id] = accessoryWeight
        }
      })
      
      setBodyweights(initialBodyweights)
      setAccessoryWeights(initialAccessoryWeights)
      
      // Calculate exercise stats
      calculateExerciseStats(session, history)
    }
    
    setLoading(false)
  }, [sessionId])

  const calculateExerciseStats = (currentSession: WorkoutSession, allHistory: WorkoutSession[]) => {
    const stats: ExerciseStats[] = currentSession.exercises.map(exercise => {
      const totalWeight = exercise.sets * exercise.reps * exercise.weight
      
      // Find previous sessions with the same exercise
      const previousSessions = allHistory
        .filter(session => 
          session.id !== currentSession.id && 
          session.completed &&
          new Date(session.date) < new Date(currentSession.date)
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      const previousExercises = previousSessions
        .flatMap(session => session.exercises)
        .filter(ex => ex.name.toLowerCase() === exercise.name.toLowerCase())
      
      // Calculate previous best total weight
      const previousBest = previousExercises.length > 0 
        ? Math.max(...previousExercises.map(ex => ex.sets * ex.reps * ex.weight))
        : 0
      
      const isPR = totalWeight > previousBest
      
      // Check for plateaus (same weight for 3+ sessions)
      const recentSameExercises = previousExercises
        .slice(0, 4) // Last 4 sessions
        .filter(ex => ex.weight === exercise.weight)
      
      const plateauWeeks = recentSameExercises.length >= 3 ? recentSameExercises.length : undefined
      
      // Recommend increase if plateau detected
      let recommendedIncrease
      if (plateauWeeks && plateauWeeks >= 3) {
        // Recommend 5-10% increase based on exercise type
        const increasePercent = exercise.weight > 100 ? 0.05 : 0.1 // 5% for heavy, 10% for lighter
        recommendedIncrease = Math.ceil(exercise.weight * (1 + increasePercent) / 5) * 5 // Round to nearest 5
      }

      return {
        exercise,
        totalWeight,
        isPR,
        previousBest,
        recommendedIncrease,
        plateauWeeks
      }
    })
    
    setExerciseStats(stats)
  }

  const handleSaveEdit = () => {
    if (!workoutSession) return
    
    const updatedSession: WorkoutSession = {
      ...workoutSession,
      exercises: editedExercises,
      mood: editedMood,
      notes: editedNotes
    }
    
    // Update in localStorage (replace the existing session)
    const history = getWorkoutHistory()
    const updatedHistory = history.map(session => 
      session.id === sessionId ? updatedSession : session
    )
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory))
    
    // Update local state
    setWorkoutSession(updatedSession)
    calculateExerciseStats(updatedSession, updatedHistory)
    setIsEditing(false)
  }

  const updateEditedExercise = (exerciseIndex: number, field: keyof Exercise, value: any) => {
    setEditedExercises(prev => prev.map((exercise, eIndex) => 
      eIndex === exerciseIndex
        ? { ...exercise, [field]: value }
        : exercise
    ))
  }

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading workout details...</Typography>
        </Box>
      </AppLayout>
    )
  }

  if (!workoutSession) {
    return (
      <AppLayout>
        <Box>
          <Alert severity="error">
            Workout session not found. Session ID: {sessionId}
          </Alert>
        </Box>
      </AppLayout>
    )
  }

  const totalWorkoutWeight = exerciseStats.reduce((total, stat) => total + stat.totalWeight, 0)
  const prCount = exerciseStats.filter(stat => stat.isPR).length
  const moodEmojis = ['😫', '😕', '😐', '😊', '🔥']
  const moodLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing']

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                {workoutSession.day_name.charAt(0).toUpperCase() + workoutSession.day_name.slice(1)} Workout
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {new Date(workoutSession.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit3 size={16} />}
                onClick={() => setIsEditing(true)}
              >
                Edit Workout
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save size={16} />}
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Workout Summary Cards */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Weight size={24} style={{ marginBottom: 8, color: '#1A73E8' }} />
                <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1 }}>
                  {totalWorkoutWeight.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Weight (lbs)
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Trophy size={24} style={{ marginBottom: 8, color: '#FFD700' }} />
                <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1 }}>
                  {prCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Personal Records
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Repeat size={24} style={{ marginBottom: 8, color: '#00C49A' }} />
                <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1 }}>
                  {exerciseStats.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Exercises
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                  <Typography variant="h5" fontWeight={600} mr={1} sx={{ lineHeight: 1 }}>
                    {workoutSession.mood}/5
                  </Typography>
                  <Typography variant="h6" sx={{ lineHeight: 1 }}>
                    {moodEmojis[workoutSession.mood - 1]}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Mood Rating
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* PR Alert */}
        {prCount > 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              🎉 Congratulations on {prCount} Personal Record{prCount > 1 ? 's' : ''}!
            </Typography>
            <Typography variant="body2">
              You've achieved new personal bests. Keep up the great work!
            </Typography>
          </Alert>
        )}

        {/* Exercise Details */}
        <Typography variant="h5" gutterBottom fontWeight={600} mb={3}>
          Exercise Breakdown
        </Typography>
        
        {exerciseStats.map((stat, index) => (
          <Card key={stat.exercise.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" fontWeight={500}>
                    {stat.exercise.name}
                  </Typography>
                  {stat.isPR && (
                    <Chip 
                      label="PR!" 
                      color="warning" 
                      size="small" 
                      icon={<Trophy size={14} />}
                    />
                  )}
                  {stat.recommendedIncrease && (
                    <Chip 
                      label={`Try ${stat.recommendedIncrease} lbs`} 
                      color="info" 
                      size="small" 
                      icon={<TrendingUp size={14} />}
                    />
                  )}
                </Box>
                <Typography variant="subtitle1" fontWeight={600} color="primary">
                  {stat.totalWeight.toLocaleString()} lbs total
                </Typography>
              </Box>

              {/* Exercise Stats Row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 80px', minWidth: '80px' }}>
                  <Typography variant="body2" color="text.secondary">Sets</Typography>
                  {isEditing ? (
                    <TextField
                      type="number"
                      value={editedExercises[index]?.sets || stat.exercise.sets}
                      onChange={(e) => updateEditedExercise(index, 'sets', parseInt(e.target.value))}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    <Typography variant="subtitle1" fontWeight={500}>
                      {stat.exercise.sets}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: '1 1 80px', minWidth: '80px' }}>
                  <Typography variant="body2" color="text.secondary">Reps</Typography>
                  {isEditing ? (
                    <TextField
                      type="number"
                      value={editedExercises[index]?.reps || stat.exercise.reps}
                      onChange={(e) => updateEditedExercise(index, 'reps', parseInt(e.target.value))}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    <Typography variant="subtitle1" fontWeight={500}>
                      {stat.exercise.reps}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: '1 1 100px', minWidth: '100px' }}>
                  {isBodyweightExercise(stat.exercise.name) ? (
                    <>
                      <Typography variant="body2" color="text.secondary">Weight</Typography>
                      {isEditing ? (
                        <Box>
                          <TextField
                            label="Bodyweight"
                            type="number"
                            value={bodyweights[stat.exercise.id] || Math.max(0, stat.exercise.weight - (accessoryWeights[stat.exercise.id] || 0))}
                            onChange={(e) => {
                              const bodyweight = parseInt(e.target.value) || 0
                              const accessoryWeight = accessoryWeights[stat.exercise.id] || 0
                              setBodyweights(prev => ({ ...prev, [stat.exercise.id]: bodyweight }))
                              updateEditedExercise(index, 'weight', bodyweight + accessoryWeight)
                            }}
                            size="small"
                            fullWidth
                            sx={{ mb: 1 }}
                          />
                          <TextField
                            label="+ Accessory"
                            type="number"
                            value={accessoryWeights[stat.exercise.id] || 0}
                            onChange={(e) => {
                              const accessoryWeight = parseInt(e.target.value) || 0
                              const bodyweight = bodyweights[stat.exercise.id] || Math.max(0, stat.exercise.weight - (accessoryWeights[stat.exercise.id] || 0))
                              setAccessoryWeights(prev => ({ ...prev, [stat.exercise.id]: accessoryWeight }))
                              updateEditedExercise(index, 'weight', bodyweight + accessoryWeight)
                            }}
                            size="small"
                            fullWidth
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="subtitle1" fontWeight={500} sx={{ fontSize: '0.9rem' }}>
                            {stat.exercise.weight} lbs total
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {bodyweights[stat.exercise.id] || (stat.exercise.weight > 180 ? 180 : stat.exercise.weight)} BW + {accessoryWeights[stat.exercise.id] || Math.max(0, stat.exercise.weight - (bodyweights[stat.exercise.id] || 180))} acc
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">Weight</Typography>
                      {isEditing ? (
                        <TextField
                          type="number"
                          value={editedExercises[index]?.weight || stat.exercise.weight}
                          onChange={(e) => updateEditedExercise(index, 'weight', parseInt(e.target.value))}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={500}>
                          {stat.exercise.weight} lbs
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
                <Box sx={{ flex: '1 1 100px', minWidth: '100px' }}>
                  <Typography variant="body2" color="text.secondary">Volume</Typography>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {stat.exercise.sets} × {stat.exercise.reps}
                  </Typography>
                </Box>
              </Box>

              {/* PR/Recommendation Info */}
              {(stat.isPR || stat.recommendedIncrease) && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  {stat.isPR && (
                    <Typography variant="body2" color="warning.main" gutterBottom>
                      🏆 New PR! Previous best: {stat.previousBest.toLocaleString()} lbs 
                      (+{(stat.totalWeight - stat.previousBest).toLocaleString()} lbs improvement)
                    </Typography>
                  )}
                  {stat.recommendedIncrease && (
                    <Typography variant="body2" color="info.main">
                      💡 You've used {stat.exercise.weight} lbs for {stat.plateauWeeks} sessions. 
                      Consider increasing to {stat.recommendedIncrease} lbs next time.
                    </Typography>
                  )}
                </Box>
              )}

              {/* Exercise Notes */}
              {(stat.exercise.notes || isEditing) && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  {isEditing ? (
                    <TextField
                      multiline
                      rows={2}
                      value={editedExercises[index]?.notes || stat.exercise.notes}
                      onChange={(e) => updateEditedExercise(index, 'notes', e.target.value)}
                      placeholder="Exercise notes..."
                      fullWidth
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2">
                      {stat.exercise.notes || 'No notes'}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Workout Notes & Mood */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workout Notes & Mood
            </Typography>
            
            {/* Mood */}
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                How did you feel?
              </Typography>
              {isEditing ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {moodEmojis[editedMood - 1]} {moodLabels[editedMood - 1]}
                  </Typography>
                  <Slider
                    value={editedMood}
                    onChange={(_, newValue) => setEditedMood(newValue as number)}
                    min={1}
                    max={5}
                    step={1}
                    marks
                    sx={{ flex: 1, maxWidth: 300 }}
                  />
                </Box>
              ) : (
                <Typography variant="subtitle1">
                  {moodEmojis[workoutSession.mood - 1]} {moodLabels[workoutSession.mood - 1]} ({workoutSession.mood}/5)
                </Typography>
              )}
            </Box>

            {/* Notes */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Workout Notes
              </Typography>
              {isEditing ? (
                <TextField
                  multiline
                  rows={4}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="How did the workout go? Any observations or adjustments for next time?"
                  fullWidth
                />
              ) : (
                <Typography variant="body1">
                  {workoutSession.notes || 'No notes recorded'}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  )
} 