'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Plus } from 'lucide-react'
import { ExerciseLibrary } from '@/lib/supabase'

interface ExerciseSelectorProps {
  onSelect: (exercise: ExerciseLibrary | string) => void
  placeholder?: string
}

/**
 * Exercise Selector Component
 * Allows users to select from canned exercises or add custom ones
 */
export function ExerciseSelector({ onSelect, placeholder = "Select or add exercise" }: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false)
  const [customExercise, setCustomExercise] = useState('')

  // TODO: Replace with real data from Supabase
  const exerciseLibrary: ExerciseLibrary[] = [
    { id: '1', name: 'Bench Press', category: 'Chest', muscle_groups: ['Chest', 'Triceps', 'Shoulders'], created_at: '2024-01-01' },
    { id: '2', name: 'Deadlift', category: 'Back', muscle_groups: ['Back', 'Glutes', 'Hamstrings'], created_at: '2024-01-01' },
    { id: '3', name: 'Squat', category: 'Legs', muscle_groups: ['Quadriceps', 'Glutes', 'Core'], created_at: '2024-01-01' },
    { id: '4', name: 'Overhead Press', category: 'Shoulders', muscle_groups: ['Shoulders', 'Triceps', 'Core'], created_at: '2024-01-01' },
    { id: '5', name: 'Pull-ups', category: 'Back', muscle_groups: ['Back', 'Biceps'], created_at: '2024-01-01' },
    { id: '6', name: 'Barbell Rows', category: 'Back', muscle_groups: ['Back', 'Biceps'], created_at: '2024-01-01' },
    { id: '7', name: 'Incline Dumbbell Press', category: 'Chest', muscle_groups: ['Chest', 'Triceps', 'Shoulders'], created_at: '2024-01-01' },
    { id: '8', name: 'Lateral Raises', category: 'Shoulders', muscle_groups: ['Shoulders'], created_at: '2024-01-01' },
    { id: '9', name: 'Tricep Dips', category: 'Arms', muscle_groups: ['Triceps', 'Chest'], created_at: '2024-01-01' },
    { id: '10', name: 'Bicep Curls', category: 'Arms', muscle_groups: ['Biceps'], created_at: '2024-01-01' },
  ]

  const handleExerciseSelect = (exercise: ExerciseLibrary | null) => {
    if (exercise) {
      onSelect(exercise)
    }
  }

  const handleCustomExercise = () => {
    if (customExercise.trim()) {
      onSelect(customExercise.trim())
      setCustomExercise('')
      setOpen(false)
    }
  }

  return (
    <>
      <Box display="flex" gap={1} alignItems="center">
        <Autocomplete
          options={exerciseLibrary}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <Box component="li" key={key} {...otherProps}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {option.name}
                  </Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Chip 
                      label={option.category} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                    {option.muscle_groups.slice(0, 2).map((muscle) => (
                      <Chip 
                        key={muscle}
                        label={muscle} 
                        size="small" 
                        color="primary"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              size="small"
              sx={{ minWidth: 250 }}
            />
          )}
          onChange={(_, value) => handleExerciseSelect(value)}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<Plus size={14} />}
          onClick={() => setOpen(true)}
        >
          Custom
        </Button>
      </Box>

      {/* Custom Exercise Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Custom Exercise</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Exercise Name"
            fullWidth
            variant="outlined"
            value={customExercise}
            onChange={(e) => setCustomExercise(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCustomExercise()
              }
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will be saved to your personal exercise library for future use.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCustomExercise} 
            variant="contained"
            disabled={!customExercise.trim()}
          >
            Add Exercise
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 