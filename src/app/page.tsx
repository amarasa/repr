'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material'
import { Calendar, Plus, TrendingUp, Dumbbell, Coffee, CheckCircle, BarChart3 } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { 
  hasWeeklyProgram, 
  getTodaysWorkout, 
  getWeeklyStats, 
  getCurrentDayName,
  getWorkoutHistory,
  Exercise,
  WorkoutSession 
} from '@/lib/mockData'

/**
 * Repr Dashboard - Smart onboarding and current workout overview
 * Shows different states: First-time user vs. Returning user
 */
export default function Dashboard() {
  const [hasProgram, setHasProgram] = useState<boolean | null>(null)
  const [todaysWorkout, setTodaysWorkout] = useState<{isRestDay: boolean, exercises: Exercise[]} | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<{completedDays: number, totalWorkoutDays: number, restDays: number} | null>(null)
  const [currentDay, setCurrentDay] = useState('')
  const [todaysCompletedWorkout, setTodaysCompletedWorkout] = useState<WorkoutSession | null>(null)

  useEffect(() => {
    // Check if user has set up their program
    const programExists = hasWeeklyProgram()
    setHasProgram(programExists)
    
    // Get today's workout and stats
    const today = getCurrentDayName()
    setCurrentDay(today.charAt(0).toUpperCase() + today.slice(1))
    
    if (programExists) {
      setTodaysWorkout(getTodaysWorkout())
      setWeeklyStats(getWeeklyStats())
      
      // Check if today's workout is already completed
      const history = getWorkoutHistory()
      const todaysDate = new Date().toDateString()
      const completedToday = history.find(session => 
        new Date(session.date).toDateString() === todaysDate &&
        session.day_name.toLowerCase() === today &&
        session.completed
      )
      setTodaysCompletedWorkout(completedToday || null)
    }
  }, [])

  // Loading state
  if (hasProgram === null) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading...</Typography>
        </Box>
      </AppLayout>
    )
  }

  // First-time user onboarding
  if (!hasProgram) {
    return (
      <AppLayout>
        <Box>
          {/* Welcome Header */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" gutterBottom fontWeight={700}>
              Welcome to Repr! 💪
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              Represent Your Best Self
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
              Let&apos;s get you started by setting up your weekly workout program. 
              This will be your template for tracking daily workouts and progress.
            </Typography>
          </Box>

          {/* Onboarding Steps */}
          <Card sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                🚀 Quick Setup (2 minutes)
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    1
                  </Box>
                  <Typography variant="body1">
                    <strong>Create your weekly program</strong> - Add exercises for each day
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: 'grey.300',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    2
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Start logging daily workouts with sets, reps, and weight
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: 'grey.300',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    3
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Track progress and celebrate your PRs
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Calendar size={20} />}
                href="/week/edit"
                sx={{ mt: 3, py: 1.5 }}
              >
                Create My Weekly Program
              </Button>
            </CardContent>
          </Card>

          {/* Feature Preview */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Card sx={{ minWidth: 250 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Dumbbell size={32} style={{ marginBottom: 8, color: '#1A73E8' }} />
                <Typography variant="h6" gutterBottom>Exercise Library</Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from 10+ exercises or add your own
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 250 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp size={32} style={{ marginBottom: 8, color: '#00C49A' }} />
                <Typography variant="h6" gutterBottom>Progress Tracking</Typography>
                <Typography variant="body2" color="text.secondary">
                  See your strength gains over time
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </AppLayout>
    )
  }

  // Returning user dashboard
  const progressPercent = weeklyStats ? (weeklyStats.completedDays / weeklyStats.totalWorkoutDays) * 100 : 0
  const todayIsRestDay = todaysWorkout?.isRestDay
  const todayHasExercises = (todaysWorkout?.exercises?.length || 0) > 0
  const isCompleted = !!todaysCompletedWorkout

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Welcome back! 💪
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentDay}, {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Today's Workout Alert */}
          {todayIsRestDay ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Rest Day Today 🛌</AlertTitle>
              Recovery is just as important as training. Take some time to relax!
            </Alert>
          ) : !todayHasExercises ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>No Workout Planned for {currentDay}</AlertTitle>
              <Box mt={1}>
                <Button variant="outlined" size="small" href="/week/edit">
                  Add Exercises to {currentDay}
                </Button>
              </Box>
            </Alert>
          ) : isCompleted ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>🎉 {currentDay}'s Workout Completed!</AlertTitle>
              Great job finishing today's workout. Check out your stats below.
            </Alert>
          ) : null}

          {/* Weekly Progress and Today's Workout Row */}
          <Box sx={{ display: { xs: 'flex', md: 'flex' }, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Weekly Progress Card */}
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUp size={20} style={{ marginRight: 8 }} />
                    <Typography variant="h6">Weekly Progress</Typography>
                  </Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Workouts Completed
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {weeklyStats?.completedDays || 0}/{weeklyStats?.totalWorkoutDays || 0}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progressPercent} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box display="flex" gap={1}>
                    <Chip 
                      label={`${weeklyStats?.completedDays || 0} Completed`} 
                      color="primary" 
                      size="small" 
                    />
                    <Chip 
                      label={`${weeklyStats?.restDays || 0} Rest Days`} 
                      variant="outlined" 
                      size="small" 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Today's Workout Card */}
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      {todayIsRestDay ? (
                        <Coffee size={20} style={{ marginRight: 8 }} />
                      ) : isCompleted ? (
                        <CheckCircle size={20} style={{ marginRight: 8 }} />
                      ) : (
                        <Calendar size={20} style={{ marginRight: 8 }} />
                      )}
                      <Typography variant="h6">
                        {todayIsRestDay ? 'Rest Day' : `${currentDay}'s Workout`}
                      </Typography>
                    </Box>
                    {todayIsRestDay ? (
                      <Chip label="Rest Day" color="secondary" size="small" />
                    ) : isCompleted ? (
                      <Chip label="Completed" color="success" size="small" icon={<CheckCircle size={14} />} />
                    ) : todayHasExercises ? (
                      <Chip label="Ready" color="primary" size="small" />
                    ) : (
                      <Chip label="Not Set" color="warning" size="small" />
                    )}
                  </Box>
                  
                  <Box mb={3}>
                    {todayIsRestDay ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        🛌 Recovery day - Let your muscles rest and rebuild
                      </Typography>
                    ) : isCompleted ? (
                      // Show completed workout stats
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Workout Stats:
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Exercises Completed
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {todaysCompletedWorkout?.exercises?.filter((ex: Exercise) => ex.completed).length} / {todaysCompletedWorkout?.exercises?.length}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Total Weight Moved
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {todaysCompletedWorkout?.exercises?.reduce((total: number, ex: Exercise) => 
                              total + (ex.sets * ex.reps * ex.weight), 0
                            ).toLocaleString()} lbs
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Mood
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {['😫', '😕', '😐', '😊', '🔥'][todaysCompletedWorkout.mood - 1]} ({todaysCompletedWorkout.mood}/5)
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Completed at {new Date(todaysCompletedWorkout.date).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                      </Box>
                    ) : todayHasExercises ? (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {todaysWorkout?.exercises?.length || 0} exercises planned:
                        </Typography>
                        {todaysWorkout?.exercises?.slice(0, 3).map((exercise: Exercise, index: number) => (
                          <Typography key={index} variant="body2" color="text.secondary">
                            • {exercise.name} ({exercise.sets}×{exercise.reps})
                          </Typography>
                        ))}
                        {(todaysWorkout?.exercises?.length || 0) > 3 && (
                          <Typography variant="body2" color="text.secondary">
                            • +{(todaysWorkout?.exercises?.length || 0) - 3} more exercises
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No exercises planned for today
                      </Typography>
                    )}
                  </Box>

                  {!todayIsRestDay && !isCompleted && todayHasExercises && (
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<Dumbbell size={16} />}
                      href={`/day/${getCurrentDayName()}`}
                    >
                      Start {currentDay}&apos;s Workout
                    </Button>
                  )}
                  
                  {!todayIsRestDay && !isCompleted && !todayHasExercises && (
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<Plus size={16} />}
                      href="/week/edit"
                    >
                      Add Exercises
                    </Button>
                  )}

                  {!todayIsRestDay && isCompleted && (
                    <Box display="flex" gap={1}>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        startIcon={<BarChart3 size={16} />}
                        href={`/workout/${todaysCompletedWorkout.id}`}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        startIcon={<Plus size={16} />}
                        href={`/day/${getCurrentDayName()}`}
                      >
                        Log Another
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Calendar size={16} />}
                  href="/week/edit"
                  sx={{ flex: { sm: '1 1 200px' } }}
                >
                  Edit Weekly Program
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TrendingUp size={16} />}
                  href="/history"
                  sx={{ flex: { sm: '1 1 200px' } }}
                >
                  View Progress
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  onClick={() => {
                    // Quick action to duplicate current week
                    // This would be implemented later
                  }}
                  sx={{ flex: { sm: '1 1 200px' } }}
                >
                  Duplicate This Week
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </AppLayout>
  )
}
