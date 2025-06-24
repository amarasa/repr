# 📋 Repr Developer Documentation

## 🏗️ Project Architecture

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 15.3.4 | React framework with App Router |
| **UI Library** | Material-UI | 7.1.2 | Component library and theming |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Database** | Supabase | Latest | PostgreSQL with real-time features |
| **Authentication** | Supabase Auth | Latest | User management and sessions |
| **Charts** | Recharts | Latest | Data visualization components |
| **Icons** | Lucide React | Latest | Consistent icon system |
| **Hosting** | Netlify | Latest | Modern web deployment platform |

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── day/
│   │   └── [day]/
│   │       └── page.tsx    # Dynamic daily workout page
│   ├── history/
│   │   └── page.tsx        # Workout history and progress
│   ├── login/
│   │   └── page.tsx        # Authentication page
│   ├── week/
│   │   └── edit/
│   │       └── page.tsx    # Weekly program builder
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Dashboard homepage
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx   # Main application layout
│   └── providers/
│       └── Providers.tsx   # Global context providers
├── lib/
│   └── supabase.ts         # Supabase client and types
└── theme/
    └── theme.ts            # MUI theme configuration
```

## 🗄️ Database Schema

### Supabase Tables

The application uses the following database structure based on the Repr specification:

#### `users` (Managed by Supabase Auth)
- Automatically handled by Supabase authentication system
- Contains user credentials, email verification, etc.

#### `weeks`
```sql
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `days`
```sql
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  is_rest_day BOOLEAN DEFAULT FALSE
);
```

#### `exercise_library`
```sql
CREATE TABLE exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  muscle_groups TEXT[] DEFAULT '{}',
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample exercise library data
INSERT INTO exercise_library (name, category, muscle_groups, instructions) VALUES
('Bench Press', 'Chest', ARRAY['Chest', 'Triceps', 'Shoulders'], 'Lie flat on bench, grip bar slightly wider than shoulders, lower to chest, press up.'),
('Deadlift', 'Back', ARRAY['Back', 'Glutes', 'Hamstrings'], 'Stand with feet hip-width, bend at hips and knees, grip bar, stand up straight.'),
('Squat', 'Legs', ARRAY['Quadriceps', 'Glutes', 'Core'], 'Stand with feet shoulder-width, lower hips back and down, keep chest up, return to standing.'),
('Overhead Press', 'Shoulders', ARRAY['Shoulders', 'Triceps', 'Core'], 'Stand tall, press bar from shoulders straight overhead, lower with control.'),
('Pull-ups', 'Back', ARRAY['Back', 'Biceps'], 'Hang from bar with overhand grip, pull body up until chin clears bar, lower slowly.'),
('Barbell Rows', 'Back', ARRAY['Back', 'Biceps'], 'Bend at hips, keep back straight, pull bar to lower chest, squeeze shoulder blades.'),
('Incline Dumbbell Press', 'Chest', ARRAY['Chest', 'Triceps', 'Shoulders'], 'Set bench to 30-45 degrees, press dumbbells from chest level to arms extended.'),
('Lateral Raises', 'Shoulders', ARRAY['Shoulders'], 'Stand with dumbbells at sides, raise arms out to shoulder height, lower slowly.'),
('Tricep Dips', 'Arms', ARRAY['Triceps', 'Chest'], 'Support body on parallel bars or bench, lower by bending elbows, push back up.'),
('Bicep Curls', 'Arms', ARRAY['Biceps'], 'Stand with dumbbells at sides, curl weights up by flexing biceps, lower slowly.');
```

#### `exercises`
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID REFERENCES days(id) ON DELETE CASCADE,
  exercise_library_id UUID REFERENCES exercise_library(id),
  name TEXT NOT NULL,
  sets INTEGER NOT NULL DEFAULT 1,
  reps INTEGER NOT NULL DEFAULT 1,
  weight DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  position INTEGER NOT NULL DEFAULT 0
);
```

#### `completed_workouts`
```sql
CREATE TABLE completed_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID REFERENCES days(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables implement Row Level Security to ensure users can only access their own data:

```sql
-- Example RLS policy for weeks table
CREATE POLICY "Users can only access their own weeks" ON weeks
  FOR ALL USING (auth.uid() = user_id);
```

## 🎨 Design System

### Color Palette

```typescript
// src/theme/theme.ts - Repr Color Palette
const palette = {
  primary: {
    main: '#1A73E8', // Electric Blue
  },
  secondary: {
    main: '#00C49A', // Energized Green
  },
  background: {
    default: '#F9FAFB', // Soft Off-White
    paper: '#FFFFFF',   // Pure White
  },
  text: {
    primary: '#212121',   // Near Black
    secondary: '#616161', // Dim Gray
  },
  divider: '#E0E0E0', // Light Gray
}
```

### Typography

```typescript
// Roboto font family with custom weights
const typography = {
  fontFamily: 'Roboto, Arial, sans-serif',
  h1: { fontWeight: 600 },
  h2: { fontWeight: 600 },
  h3: { fontWeight: 500 },
  // ... additional typography scales
}
```

### Component Styling

- **Border Radius**: 8px for buttons, 12px for cards
- **Shadows**: Subtle elevation using `0 2px 8px rgba(0,0,0,0.1)`
- **Spacing**: 8px base unit with Material-UI spacing system
- **Breakpoints**: Mobile-first approach with sm, md, lg, xl breakpoints

## 🔌 API Integration

### Supabase Client Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Authentication Flow

```typescript
// Login/Signup
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Check session
const { data: { session } } = await supabase.auth.getSession()

// Logout
const { error } = await supabase.auth.signOut()
```

### Data Operations

```typescript
// Fetch user's weeks
const { data: weeks, error } = await supabase
  .from('weeks')
  .select(`
    *,
    days (
      *,
      workout_blocks (
        *,
        exercises (*)
      )
    )
  `)
  .eq('user_id', userId)

// Insert new workout
const { data, error } = await supabase
  .from('weeks')
  .insert({
    user_id: session.user.id,
    start_date: '2024-01-15'
  })
```

## 🧩 Component Architecture

### Layout Components

#### `AppLayout.tsx`
```typescript
interface AppLayoutProps {
  children: React.ReactNode
}

/**
 * Main application layout with drawer navigation
 * Features:
 * - Responsive sidebar navigation
 * - Mobile-friendly hamburger menu
 * - Consistent header and spacing
 * - Route-based active states
 */
export function AppLayout({ children }: AppLayoutProps)
```

#### Navigation Structure
- **Dashboard** (`/`) - Overview and quick actions
- **Weekly Program** (`/week/edit`) - Program builder
- **History** (`/history`) - Past workouts and analytics
- **Authentication** (`/login`) - Login/signup forms

### Page Components

#### Dashboard (`src/app/page.tsx`)
- **Purpose**: Weekly overview and quick actions
- **Features**: Progress tracking, today's workout preview
- **State Management**: Mock data (to be replaced with Supabase)

#### Weekly Program Builder (`src/app/week/edit/page.tsx`)
- **Purpose**: Create and edit workout templates
- **Features**: Drag-and-drop (planned), exercise management
- **State Management**: Complex nested state for days/blocks/exercises

#### Daily Workout (`src/app/day/[day]/page.tsx`)
- **Purpose**: Exercise logging and completion tracking
- **Features**: Real-time updates, mood tracking, notes
- **Dynamic Routing**: Uses Next.js dynamic routes for day names

### Shared Utilities

#### Type Definitions
```typescript
// Core data types matching database schema
interface Week {
  id: string
  user_id: string
  start_date: string
  created_at: string
}

interface Exercise {
  id: string
  block_id: string
  name: string
  sets: number
  reps: number
  weight: number
  notes?: string
  mood?: number
}
```

## 🔄 State Management

### Local State Patterns

The application primarily uses React's built-in state management:

```typescript
// Complex nested state example
const [weekProgram, setWeekProgram] = useState<DayProgram[]>([...])

// Update nested state immutably
const updateExercise = (dayIndex: number, blockIndex: number, field: string, value: any) => {
  setWeekProgram(prev => prev.map((day, dIndex) => 
    dIndex === dayIndex 
      ? {
          ...day,
          blocks: day.blocks.map((block, bIndex) => 
            bIndex === blockIndex 
              ? { ...block, [field]: value }
              : block
          )
        }
      : day
  ))
}
```

### Future State Management

For larger scale, consider implementing:
- **Zustand** for global state management
- **React Query** for server state caching
- **Context API** for theme and user preferences

## 📊 Data Visualization

### Recharts Implementation

```typescript
// Progress chart example
<ResponsiveContainer width="100%" height={300}>
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
    />
  </LineChart>
</ResponsiveContainer>
```

### Chart Types Used
- **Line Charts**: Weight progression over time
- **Bar Charts**: Volume metrics (planned)
- **Pie Charts**: Workout completion rates (planned)

## 🔐 Security Implementation

### Authentication Guards

```typescript
// Middleware for protected routes (to be implemented)
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

### Data Validation

```typescript
// Input validation example
const validateExercise = (exercise: Exercise): string[] => {
  const errors: string[] = []
  
  if (!exercise.name.trim()) {
    errors.push('Exercise name is required')
  }
  
  if (exercise.sets < 1) {
    errors.push('Sets must be at least 1')
  }
  
  return errors
}
```

## 🚀 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Code Quality

- **ESLint**: Configured with Next.js rules
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (recommended)
- **Husky**: Pre-commit hooks (to be added)

## 🧪 Testing Strategy

### Testing Stack (Planned)
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **MSW**: API mocking for tests

### Test Structure
```
tests/
├── __mocks__/          # Mock implementations
├── components/         # Component unit tests
├── pages/              # Page integration tests
├── utils/              # Utility function tests
└── e2e/                # End-to-end test suites
```

## 📦 Build & Deployment

### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build for production
npm run build

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Build Configuration

```typescript
// next.config.ts
const nextConfig = {
  // Static export for Netlify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['supabase.co'],
  },
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Customization Guide

### Adding New Pages

1. Create page component in `src/app/[route]/page.tsx`
2. Add navigation item to `AppLayout.tsx`
3. Update TypeScript types if needed
4. Add to routing configuration

### Extending Database Schema

1. Create migration in Supabase dashboard
2. Update TypeScript interfaces in `src/lib/supabase.ts`
3. Implement RLS policies
4. Update API calls in components

### Custom Themes

```typescript
// Extend theme in src/theme/theme.ts
const customTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    tertiary: {
      main: '#FF6B35', // Custom color
    },
  },
})
```

## 🐛 Debugging

### Common Issues

1. **Supabase Connection Errors**
   - Check environment variables
   - Verify RLS policies
   - Test with Supabase CLI

2. **TypeScript Errors**
   - Ensure proper type definitions
   - Check MUI component prop types
   - Validate API response types

3. **Build Failures**
   - Clear `.next` directory
   - Update dependencies
   - Check for unused imports

### Debug Tools

- **React Developer Tools**: Component inspection
- **Supabase Dashboard**: Database queries and logs
- **Next.js DevTools**: Performance and routing
- **Browser DevTools**: Network and console debugging

## 📈 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for large components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton height={300} />,
  ssr: false
})
```

### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image'

<Image
  src="/workout-image.jpg"
  alt="Workout"
  width={800}
  height={400}
  priority={false}
  placeholder="blur"
/>
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze
```

## 🔮 Future Enhancements

### Planned Features
- **Offline Support**: PWA capabilities with service workers
- **Push Notifications**: Workout reminders and achievements
- **Exercise Library**: Searchable database with instructions
- **Social Features**: Share workouts and compete with friends
- **Wearable Integration**: Sync with fitness trackers
- **AI Recommendations**: Intelligent program suggestions

### Technical Improvements
- **Database Optimization**: Indexing and query optimization
- **Caching Strategy**: Redis for session storage
- **API Rate Limiting**: Prevent abuse and ensure stability
- **Monitoring**: Error tracking and performance metrics
- **CI/CD Pipeline**: Automated testing and deployment

---

*This documentation is maintained alongside the codebase. Please update when making significant changes.* 