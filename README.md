# 🏋️‍♂️ Repr - Workout Tracker

**A modern, clean weekly workout tracker for personal fitness programs.**

Repr is a lightweight, responsive web application built with Next.js and Material-UI that helps you plan, track, and analyze your weekly workout routines.

![Repr Dashboard](https://via.placeholder.com/800x400/1A73E8/FFFFFF?text=Repr+Dashboard)

## ✨ Features

### 🗓️ Weekly Program Builder
- Create personalized 7-day workout templates
- Define rest days and active workout days
- Add exercises directly to each day
- Exercise library with pre-defined common exercises
- Custom exercise creation for personalized workouts

### 📱 Daily Workout Logging
- Interactive workout interface for real-time logging
- Track sets, reps, weight, and personal notes
- Mood tracking with emoji slider
- Mark exercises and entire workouts as complete
- Responsive design for mobile and desktop use

### 📊 Progress Tracking & History
- View past workout history with detailed logs
- Interactive progress charts using Recharts
- Track personal records and achievements
- Completion statistics and performance analytics
- Filter and search workout history

### 🔐 User Authentication
- Secure email/password authentication via Supabase
- User session management
- Protected routes and data privacy

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/repr.git
   cd repr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 How to Use Repr

### Setting Up Your First Workout Program

1. **Sign up for an account** at `/login`
2. **Navigate to Weekly Program** (`/week/edit`)
3. **Configure each day:**
   - Toggle rest days using the switch
   - Use exercise selector to add exercises from the library
   - Choose from common exercises (Bench Press, Deadlift, etc.)
   - Or create custom exercises for your specific needs
   - Set target sets, reps, and weights for each exercise
4. **Save your program**

### Logging Your Daily Workouts

1. **Start from the Dashboard** - View today's scheduled workout
2. **Click "Start Workout"** or navigate to `/day/[dayname]`
3. **Track your progress:**
   - Set your mood for the day (1-5 scale)
   - Check off completed exercises
   - Update actual weights and reps performed
   - Add notes for each exercise
4. **Complete the workout** when finished

### Analyzing Your Progress

1. **Visit History page** (`/history`)
2. **Review workout logs:**
   - Expand accordion items to see detailed exercise data
   - Filter by date range or completion status
3. **View progress charts:**
   - Switch to "Progress Charts" tab
   - Analyze weight progression over time
   - Track personal records and improvements

## 🎨 User Interface

### Design System
- **Primary Color**: Electric Blue (#1A73E8)
- **Secondary Color**: Energized Green (#00C49A)
- **Typography**: Roboto font family
- **Icons**: Lucide React icon library
- **Charts**: Recharts for data visualization

### Responsive Layout
- **Mobile-first design** with breakpoints for tablet and desktop
- **Drawer navigation** with collapsible sidebar
- **Touch-friendly** buttons and form elements
- **Optimized for** both portrait and landscape orientations

## 🔧 Customization

### Adding Custom Exercises
- Use the "Add Exercise" button in any workout block
- Exercise data persists across sessions
- Set default values for quick entry

### Workout Templates
- "Duplicate Last Week" feature for consistent programming
- Import/export functionality (coming soon)
- Share templates with other users (planned feature)

### Data Export
- Export workout history to CSV (planned)
- Backup data functionality (planned)
- Integration with fitness apps (roadmap)

## 🛡️ Privacy & Security

- **Secure authentication** via Supabase Auth
- **Data isolation** - users only see their own data
- **HTTPS encryption** for all data transmission
- **Privacy-first** - no tracking or analytics beyond usage metrics

## 🐛 Troubleshooting

### Common Issues

**Login not working?**
- Check your internet connection
- Verify Supabase configuration in `.env.local`
- Clear browser cache and cookies

**Charts not displaying?**
- Ensure you have workout history data
- Check browser compatibility (modern browsers required)
- Refresh the page or restart the application

**Mobile layout issues?**
- Update to the latest version of your mobile browser
- Clear browser cache
- Report issues on GitHub

### Getting Help

- 📖 Check the [Documentation](./documentation.md) for technical details
- 🐛 Report bugs on [GitHub Issues](https://github.com/yourusername/repr/issues)
- 💬 Join our community discussions
- 📧 Contact support: support@repr.app

## 🔄 Updates & Roadmap

### Recent Updates
- ✅ Core workout tracking functionality
- ✅ Progress visualization with charts
- ✅ Responsive mobile design
- ✅ Dark/light theme support

### Upcoming Features
- 🔄 Exercise library with instructional videos
- 🔄 Social features and workout sharing
- 🔄 Integration with fitness wearables
- 🔄 Advanced analytics and insights
- 🔄 Nutrition tracking integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the fitness community**

*Repr - Represent Your Best Self*
