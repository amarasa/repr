
# 🏋️‍♂️ Repr - Workout Tracker App Spec

_A modern, clean weekly workout tracker for personal fitness programs._

---

## 📌 Purpose

Build a lightweight, modern web app that allows users (yourself + a small group) to:

- Build a personalized **weekly training program**
- Log workout details (sets, reps, weight, notes, mood)
- Mark workouts as complete
- View historical progress over time

---

## 🧱 Tech Stack

| Category        | Stack                          |
|----------------|--------------------------------|
| Frontend       | Next.js 14 (App Router)        |
| UI Components  | MUI (Material UI)              |
| Auth & DB      | Supabase (Auth, Realtime DB)   |
| Hosting        | Vercel                         |
| Icon Library   | Lucide Icons                   |
| CSS Framework  | MUI + Custom Theme             |

---

## 🎨 Design System

### Color Palette

| Color Use       | Hex Code  | Label               |
|----------------|-----------|---------------------|
| Primary         | #1A73E8   | Electric Blue       |
| Accent          | #00C49A   | Energized Green     |
| Background      | #F9FAFB   | Soft Off-White      |
| Paper (Card)    | #FFFFFF   | Pure White          |
| Divider/Lines   | #E0E0E0   | Light Gray          |
| Text Primary    | #212121   | Near Black          |
| Text Secondary  | #616161   | Dim Gray            |

### Typography
- Use MUI’s `Roboto` default

### Icon Set
- [Lucide Icons](https://lucide.dev/)

---

## 🧭 Feature Overview

### ✅ Authentication
- Email/password via Supabase

### 🗓️ Weekly Program Builder
- Define a 7-day weekly template (starting Monday)
- Create program for current week (editable)
- Option to "Duplicate Last Week"
- Define rest days

### 🏋️ Daily Workout Editor

Each Day includes:
- Workout Blocks (e.g., Warm-Up, Main Lifts, Accessories)
- Inside Blocks → List of Exercises:
  - Name
  - Sets, Reps, Weight
  - Notes (optional)
  - Mood (emoji / slider)
- Optional: Drag and drop reorder

### ✅ Workout Completion
- Mark entire workout day as “Complete”

### 📈 History / Progress Tracking
- View past weeks
- For each exercise: View past weights, reps, notes
- Stretch: Simple chart or PR tracking

---

## 🗂️ Pages

| Route           | Description                              |
|----------------|------------------------------------------|
| `/login`        | Auth page (Supabase email/password)      |
| `/`             | Home dashboard (Current week overview)   |
| `/week/edit`    | Weekly program builder                   |
| `/day/[day]`    | Daily workout detail                     |
| `/history`      | Workout logs & historical data           |

---

## 🧩 MUI Component Mapping

| Feature                 | MUI Component Suggestions                 |
|------------------------|-------------------------------------------|
| Layout (sidebar/nav)   | `<Drawer>`, `<AppBar>`, `<Toolbar>`       |
| Weekly planner grid    | `<Grid>`, `<Paper>`, `<Card>`             |
| Workout inputs         | `<TextField>`, `<Slider>`, `<Select>`     |
| Mood tracker           | `<Slider>` + emoji or `<Rating>` stars    |
| Completion toggles     | `<Checkbox>` or `<Switch>`                |
| Historical view        | `<Accordion>` or `<Timeline>`             |
| Charts (stretch goal)  | `recharts` or `chart.js` w/ MUI styling   |

---

## ⚙️ Supabase Schema Draft

### `users`
_Supabase handles this natively_

### `weeks`
```
id (uuid) PK  
user_id (uuid) FK -> users  
start_date (date)  
created_at (timestamp)
```

### `days`
```
id (uuid) PK  
week_id (uuid) FK -> weeks  
day_of_week (int)  // 1=Monday  
is_rest_day (bool)
```

### `workout_blocks`
```
id (uuid) PK  
day_id (uuid) FK -> days  
title (text)  
position (int)
```

### `exercises`
```
id (uuid) PK  
block_id (uuid) FK -> workout_blocks  
name (text)  
sets (int)  
reps (int)  
weight (float)  
notes (text)  
mood (int)
```

### `completed_workouts`
```
id (uuid) PK  
day_id (uuid) FK  
completed_at (timestamp)
```

---

## 📌 Notes for Devs

- Use **App Router** in Next.js (`app/` directory)
- Use **Supabase client library**
- Pages protected by session checks
- Deploy via **Vercel**
- Client-heavy MVP with minimal API

