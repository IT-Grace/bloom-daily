# Bloom - Daily Habit Tracker

A beautiful habit tracking application with a feminine design using white, yellow, and grey tones. Built with React, Express, and in-memory storage.

## Overview

Bloom helps users build positive daily routines by:
- Creating recurring tasks (daily, monthly, yearly) with specific times
- Tracking habit completion with beautiful visualizations
- Sending browser notifications 15 minutes before scheduled tasks
- Providing daily summaries and monthly progress reports
- Displaying calendar heatmaps and completion statistics

## Project Architecture

### Frontend (React + TypeScript)
- **Pages**: Dashboard, Habits, Calendar View, Progress Reports
- **Components**: Task cards, dialogs, stats cards, progress rings, calendar heatmap
- **Design System**: Feminine aesthetic with yellow (#FFD166) primary color, soft greys, rounded corners
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side navigation
- **UI Library**: Shadcn components with custom theming

### Backend (Express + Node.js)
- **Storage**: In-memory storage using MemStorage class
- **API Routes**: RESTful endpoints for tasks and completions
- **Data Models**: Tasks (with frequency scheduling) and Completions

### Key Features
1. **Task Management**
   - Create, edit, delete recurring tasks
   - Support for daily, monthly, and yearly frequencies
   - Time-based scheduling with specific times

2. **Progress Tracking**
   - Mark tasks as complete/incomplete
   - Calculate daily completion rates
   - Track streaks and patterns

3. **Notifications**
   - Browser notifications 15 minutes before task time
   - Permission handling on app load

4. **Reports & Analytics**
   - Daily summary with completion percentage
   - Monthly progress reports with charts
   - Calendar heatmap visualization
   - Streak tracking

## Data Schema

### Tasks
- id, title, description (optional)
- time (HH:MM format)
- frequency (daily, monthly, yearly)
- dayOfMonth (for monthly tasks)
- monthOfYear, dayOfYear (for yearly tasks)
- isActive, createdAt

### Completions
- id, taskId, completedAt, date (YYYY-MM-DD)

## Design System

### Colors
- **Primary**: Yellow (#FFD166) - warm, encouraging
- **Background**: Pure white (#FFFFFF)
- **Card**: Soft cream (#FEF9F3)
- **Text**: Dark grey for primary, medium grey for secondary
- **Success**: Soft green for achievements
- **Alert**: Soft coral for overdue items

### Typography
- **Headers**: Playfair Display (serif) for elegance
- **Body**: Inter (sans-serif) for readability
- **Weights**: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

### Design Principles
- Generous whitespace and breathing room
- Soft rounded corners (8px, 12px, 16px)
- Subtle shadows for elevation
- Smooth transitions (100-200ms)
- Warm, encouraging language

## User Preferences

- Clean, feminine aesthetic with soft colors
- Focus on positive reinforcement and achievement
- Clear visual hierarchy and easy navigation
- Responsive design for all screen sizes

## Recent Changes

**October 18, 2025**
- Initial project setup
- Complete schema definition for tasks and completions
- Full frontend component library built
- All pages implemented (Dashboard, Habits, Calendar, Reports)
- Design system configured with yellow/grey palette
- Sidebar navigation with theme toggle
- Task creation and editing dialogs
- Browser notification foundation

## Next Steps

1. Implement backend API endpoints
2. Connect frontend to backend
3. Add notification scheduling logic
4. Test all user journeys
5. Polish loading and error states
