'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  Code, 
  Database, 
  Shield, 
  Smartphone,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'

/**
 * Repr Project Status Page
 * Shows completed features, pending tasks, and project progress
 */
export default function StatusPage() {
  const overallProgress = 60 // Estimated overall completion percentage (adjusted for new features)

  const completedFeatures = [
    { name: 'Project Setup & Configuration', description: 'Next.js 15, TypeScript, MUI, Tailwind' },
    { name: 'Responsive Design System', description: 'Custom theme, colors, typography, mobile-first' },
    { name: 'Navigation & Layout', description: 'Sidebar navigation, app layout, mobile drawer' },
    { name: 'Dashboard Page', description: 'Weekly overview, progress cards, quick actions' },
    { name: 'Weekly Program Builder', description: 'Day-by-day exercise planning, rest day toggles' },
    { name: 'Exercise Library System', description: 'Smart autocomplete, 10+ common exercises, custom exercises' },
    { name: 'Daily Workout Page', description: 'Exercise logging, mood tracking, completion status' },
    { name: 'History & Progress Page', description: 'Workout history UI, progress charts with Recharts' },
    { name: 'Authentication UI', description: 'Login/signup forms, beautiful auth flow' },
    { name: 'Simplified Data Structure', description: 'Removed complex blocks, direct day-to-exercise mapping' },
    { name: 'Documentation', description: 'Complete README, developer docs, database schema' },
    { name: 'Branding', description: 'Full rebrand to Repr with consistent styling' },
    { name: 'Error Handling', description: 'Fixed hydration errors, React 19 compatibility' },
    { name: 'Netlify Configuration', description: 'Static export setup, deployment config, security headers' },
  ]

  const pendingTasks = [
    { 
      name: 'Supabase Project Setup', 
      priority: 'High',
      estimate: '30 min',
      description: 'Create project, configure environment variables'
    },
    { 
      name: 'Database Schema Implementation', 
      priority: 'High',
      estimate: '45 min',
      description: 'Create 5 tables: users, weeks, days, exercises, exercise_library'
    },
    { 
      name: 'Real Authentication', 
      priority: 'High',
      estimate: '1 hour',
      description: 'Replace mock auth with Supabase Auth, protected routes'
    },
    { 
      name: 'Data Persistence', 
      priority: 'High',
      estimate: '2 hours',
      description: 'Replace mock data with real Supabase queries'
    },
    { 
      name: 'Workout Completion Tracking', 
      priority: 'Medium',
      estimate: '1 hour',
      description: 'Save completed workouts, progress calculations'
    },
    { 
      name: 'History Data Integration', 
      priority: 'Medium',
      estimate: '1 hour',
      description: 'Real workout history, progress charts with actual data'
    },
    { 
      name: 'Duplicate Week Feature', 
      priority: 'Low',
      estimate: '30 min',
      description: 'Copy previous week\'s program to current week'
    },
    { 
      name: 'Data Export/Backup', 
      priority: 'Low',
      estimate: '1 hour',
      description: 'Export workout data, backup functionality'
    },
    { 
      name: 'Calendar View', 
      priority: 'Medium',
      estimate: '2 hours',
      description: 'Interactive calendar to view daily workouts by clicking dates'
    },
    { 
      name: 'Daily Workout Stats', 
      priority: 'Medium',
      estimate: '1.5 hours',
      description: 'Modern stats display including total weight moved, reps, sets'
    },
    { 
      name: 'Workout Timer', 
      priority: 'Medium',
      estimate: '1 hour',
      description: 'Start/stop workout timer to track total duration'
    },
    { 
      name: 'Social Sharing Badges', 
      priority: 'Low',
      estimate: '3 hours',
      description: 'Generate shareable workout summary images (duration, weight moved)'
    },
    { 
      name: 'PR Tracking System', 
      priority: 'Medium',
      estimate: '2 hours',
      description: 'Track personal records for each exercise with shareable badges'
    },
  ]

  const techStack = [
    { name: 'Frontend', tech: 'Next.js 15, React 19', status: 'Complete' },
    { name: 'UI Library', tech: 'Material-UI 7.1.2', status: 'Complete' },
    { name: 'Styling', tech: 'Tailwind CSS 4.x', status: 'Complete' },
    { name: 'Database', tech: 'Supabase PostgreSQL', status: 'Pending' },
    { name: 'Authentication', tech: 'Supabase Auth', status: 'UI Only' },
    { name: 'Charts', tech: 'Recharts', status: 'Complete' },
    { name: 'Icons', tech: 'Lucide React', status: 'Complete' },
    { name: 'Hosting', tech: 'Netlify', status: 'Complete' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'success'
      case 'Pending': return 'error'
      case 'UI Only': return 'warning'
      case 'Ready': return 'info'
      default: return 'default'
    }
  }

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            🚀 Repr Project Status
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track our progress building the ultimate workout tracker
          </Typography>
        </Box>

        {/* Overall Progress */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Overall Progress</Typography>
              <Typography variant="h4" color="primary" fontWeight={600}>
                {overallProgress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={overallProgress} 
              sx={{ height: 10, borderRadius: 5, mb: 2 }}
            />
                         <Typography variant="body2" color="text.secondary">
               Frontend complete, backend integration in progress, exciting new features planned!
             </Typography>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle size={32} color="#4CAF50" style={{ marginBottom: 8 }} />
              <Typography variant="h3" color="success.main" fontWeight={600}>
                {completedFeatures.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Features Complete
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Circle size={32} color="#FF9800" style={{ marginBottom: 8 }} />
              <Typography variant="h3" color="warning.main" fontWeight={600}>
                {pendingTasks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks Remaining
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Zap size={32} color="#FF6B35" style={{ marginBottom: 8 }} />
              <Typography variant="h3" sx={{ color: '#FF6B35' }} fontWeight={600}>
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Features Added
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Detailed Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* Completed Features */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ChevronDown size={20} />}>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle size={20} color="#4CAF50" />
                <Typography variant="h6">✅ Completed Features ({completedFeatures.length})</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {completedFeatures.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle size={20} color="#4CAF50" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.name}
                      secondary={feature.description}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Pending Tasks */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ChevronDown size={20} />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Circle size={20} color="#FF9800" />
                <Typography variant="h6">🔄 Pending Tasks ({pendingTasks.length})</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {pendingTasks.map((task, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Circle size={20} color="#FF9800" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">{task.name}</Typography>
                          <Chip 
                            label={task.priority} 
                            size="small" 
                            color={getPriorityColor(task.priority) as any}
                          />
                          <Chip 
                            label={task.estimate} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={task.description}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Tech Stack Status */}
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown size={20} />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Code size={20} color="#2196F3" />
                <Typography variant="h6">⚙️ Technology Stack</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {techStack.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.tech}
                            </Typography>
                          </Box>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={getStatusColor(item.status) as any}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

                     {/* Upcoming Features Preview */}
           <Accordion>
             <AccordionSummary expandIcon={<ChevronDown size={20} />}>
               <Box display="flex" alignItems="center" gap={1}>
                 <Zap size={20} color="#FF6B35" />
                 <Typography variant="h6">🚀 Exciting Upcoming Features</Typography>
               </Box>
             </AccordionSummary>
             <AccordionDetails>
               <Box sx={{ pl: 2 }}>
                 <Typography variant="h6" gutterBottom color="primary">
                   📅 Interactive Calendar View
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                   Click any date to instantly view what workout you did that day. Visual indicators for completed workouts, rest days, and PRs.
                 </Typography>

                 <Typography variant="h6" gutterBottom color="secondary">
                   📊 Advanced Daily Stats
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                   Beautiful, modern analytics showing total weight moved, volume (sets × reps × weight), workout intensity, and progress trends.
                 </Typography>

                 <Typography variant="h6" gutterBottom sx={{ color: '#FF9800' }}>
                   ⏱️ Workout Timer & Duration
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                   Start/stop timer to track total workout duration. See how your workout efficiency improves over time.
                 </Typography>

                 <Typography variant="h6" gutterBottom sx={{ color: '#9C27B0' }}>
                   🏆 PR Tracking & Social Sharing
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                   Automatic PR detection with celebration badges. Share your achievements with beautiful, Webull-style cards showing your stats and PRs.
                 </Typography>

                 <Typography variant="h6" gutterBottom sx={{ color: '#FF6B35' }}>
                   📱 Social Workout Badges
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   Generate Instagram-ready workout summary cards featuring duration, total weight moved, and workout highlights. Perfect for motivation and accountability!
                 </Typography>
               </Box>
             </AccordionDetails>
           </Accordion>

           {/* Next Steps */}
           <Accordion>
             <AccordionSummary expandIcon={<ChevronDown size={20} />}>
               <Box display="flex" alignItems="center" gap={1}>
                 <TrendingUp size={20} color="#9C27B0" />
                 <Typography variant="h6">🎯 Recommended Next Steps</Typography>
               </Box>
             </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ pl: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Phase 1: Backend Foundation (2-3 hours)
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="1. Set up Supabase project and environment" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Create database tables and sample data" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Implement real authentication" />
                  </ListItem>
                </List>

                <Typography variant="h6" gutterBottom color="secondary" sx={{ mt: 3 }}>
                  Phase 2: Data Integration (3-4 hours)
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="4. Replace mock data with Supabase queries" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="5. Implement workout completion tracking" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="6. Add real progress history" />
                  </ListItem>
                </List>

                               <Typography variant="h6" gutterBottom sx={{ color: '#FF9800', mt: 3 }}>
                 Phase 3: Advanced Features (9-10 hours)
               </Typography>
               <List dense>
                 <ListItem>
                   <ListItemText primary="7. Build interactive calendar view" />
                 </ListItem>
                 <ListItem>
                   <ListItemText primary="8. Add daily workout stats & analytics" />
                 </ListItem>
                 <ListItem>
                   <ListItemText primary="9. Implement workout timer (start/stop)" />
                 </ListItem>
                 <ListItem>
                   <ListItemText primary="10. Create PR tracking system" />
                 </ListItem>
                 <ListItem>
                   <ListItemText primary="11. Build social sharing badges" />
                 </ListItem>
               </List>

               <Typography variant="h6" gutterBottom sx={{ color: '#9C27B0', mt: 3 }}>
                 Phase 4: Polish & Launch (1-2 hours)
               </Typography>
               <List dense>
                 <ListItem>
                   <ListItemText primary="12. Add duplicate week feature" />
                 </ListItem>
                 <ListItem>
                   <ListItemText primary="13. Implement data export/backup" />
                 </ListItem>
                 <ListItem>
                   <ListItemText primary="14. Deploy to production" />
                 </ListItem>
               </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Footer Note */}
                 <Card sx={{ mt: 4, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
           <CardContent>
             <Typography variant="body2" textAlign="center">
               💡 <strong>Status:</strong> Frontend is production-ready! Backend integration + exciting social features will make this the ultimate workout tracker. 🚀
             </Typography>
           </CardContent>
         </Card>
      </Box>
    </AppLayout>
  )
} 