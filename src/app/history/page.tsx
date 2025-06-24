'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Tabs,
  Tab,
} from '@mui/material'
import { ChevronDown, Calendar, TrendingUp, Award } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HistoryWorkout {
  id: string
  date: string
  dayName: string
  completed: boolean
  blocks: Array<{
    title: string
    exercises: Array<{
      name: string
      sets: number
      reps: number
      weight: number
      notes?: string
    }>
  }>
}

/**
 * History & Progress Tracking Page
 * Shows past workouts, completion status, and progress charts
 */
export default function HistoryPage() {
  const [currentTab, setCurrentTab] = useState(0)

  // TODO: Replace with real data from Supabase
  const workoutHistory: HistoryWorkout[] = []

  // TODO: Replace with real progress data from Supabase
  const benchPressProgress = [
    { date: '2024-01-01', weight: 0 },
  ]

  const deadliftProgress = [
    { date: '2024-01-01', weight: 0 },
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Workout History & Progress
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your fitness journey over time
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Calendar size={20} color="#1A73E8" />
                <Typography variant="h6">Total Workouts</Typography>
              </Box>
              <Typography variant="h3" color="primary" fontWeight={600}>
                {workoutHistory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp size={20} color="#00C49A" />
                <Typography variant="h6">Completion Rate</Typography>
              </Box>
              <Typography variant="h3" color="secondary" fontWeight={600}>
                {workoutHistory.length > 0 
                  ? Math.round((workoutHistory.filter(w => w.completed).length / workoutHistory.length) * 100)
                  : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Award size={20} color="#FF9800" />
                <Typography variant="h6">Personal Records</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#FF9800' }} fontWeight={600}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Workout History" />
            <Tab label="Progress Charts" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Recent Workouts
            </Typography>
            {workoutHistory.length > 0 ? (
              workoutHistory.map((workout) => (
                <Accordion key={workout.id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {workout.dayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      <Chip 
                        label={workout.completed ? 'Completed' : 'Skipped'} 
                        color={workout.completed ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {workout.completed ? (
                      workout.blocks.map((block, blockIndex) => (
                        <Box key={blockIndex} mb={2}>
                          <Typography variant="subtitle2" fontWeight={500} mb={1}>
                            {block.title}
                          </Typography>
                          {block.exercises.map((exercise, exerciseIndex) => (
                            <Box key={exerciseIndex} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 0.5,
                              px: 2,
                              backgroundColor: 'background.default',
                              borderRadius: 1,
                              mb: 1
                            }}>
                              <Typography variant="body2">
                                {exercise.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {exercise.sets} × {exercise.reps} @ {exercise.weight}lbs
                                {exercise.notes && ` - ${exercise.notes}`}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        This workout was skipped
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No workout history yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Complete some workouts to see your progress here
                  </Typography>
                  <Button
                    variant="contained"
                    href="/week/edit"
                    startIcon={<Calendar size={16} />}
                  >
                    Set Up Weekly Program
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Exercise Progress
            </Typography>
            
            {/* Bench Press Chart */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bench Press Progress
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={benchPressProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#1A73E8" 
                        strokeWidth={2}
                        dot={{ fill: '#1A73E8', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            {/* Deadlift Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Deadlift Progress
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={deadliftProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#00C49A" 
                        strokeWidth={2}
                        dot={{ fill: '#00C49A', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </AppLayout>
  )
} 