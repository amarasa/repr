'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
} from '@mui/material'
import { Dumbbell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

/**
 * Repr Login Page
 * Handles email/password authentication via Supabase
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setError('Please check your email for verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Dumbbell size={32} color="#1A73E8" />
              <Typography variant="h4" color="primary" fontWeight={600}>
                Repr
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {isSignUp ? 'Create your account' : 'Welcome back! Sign in to continue'}
            </Typography>
          </Box>

          {/* Auth Form */}
          <form onSubmit={handleAuth}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5 }}
              >
                {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Toggle Auth Mode */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              sx={{ mt: 1 }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
} 