# BloomDaily 🌸

A beautiful, feminine habit tracking application that helps you build and maintain daily habits with encouraging visual feedback and achievement celebrations.

![BloomDaily Screenshot](https://via.placeholder.com/800x400?text=BloomDaily+Dashboard)

## ✨ Features

- **Beautiful UI**: Warm, feminine design with soft colors and gentle animations
- **Flexible Habit Scheduling**: Support for daily, monthly, and yearly habits
- **Achievement System**: Celebrate milestones at 7, 30, and 100-day streaks
- **Progress Tracking**: Visual progress rings and completion statistics
- **Calendar Heatmap**: See your consistency at a glance
- **Category Organization**: Color-coded habit categories for easy organization
- **Responsive Design**: Works beautifully on desktop and mobile devices

## 🏗️ Architecture

BloomDaily is built as a full-stack TypeScript application with:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Drizzle ORM
- **Database**: PostgreSQL
- **UI Components**: shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state

### Project Structure

```
BloomDaily/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configuration
├── server/                # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── db.ts              # Database connection
│   └── storage.ts         # Data access layer
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema and validation
└── scripts/               # Development scripts
    └── setup-db.bat       # Database setup script
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BloomDaily
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bloomdb

   # Development Environment
   NODE_ENV=development
   PORT=5001

   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production

   # Application Configuration
   APP_NAME=BloomDaily
   APP_VERSION=1.0.0
   ```

4. **Set up the database**

   ```bash
   npm run db:setup
   ```

   Or manually:

   ```bash
   createdb bloomdb -U postgres
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:5001](http://localhost:5001)

## 📱 Usage

### Creating Habits

1. Click the **"Add New Habit"** button on the dashboard
2. Fill in the habit details:
   - **Title**: Name your habit
   - **Description**: Optional details
   - **Time**: When you want to do this habit
   - **Frequency**: Daily, Monthly, or Yearly
   - **Category**: Organize with colors
3. Save and start tracking!

### Habit Frequencies

- **Daily**: Happens every day at a specified time
- **Monthly**: Happens on a specific day of the month (e.g., 15th of each month)
- **Yearly**: Happens on a specific date each year (e.g., January 1st)

### Achievements

Earn milestone badges for consistent habit completion:

- 🥉 **7-day streak**: Bronze achievement
- 🥈 **30-day streak**: Silver achievement
- 🥇 **100-day streak**: Gold achievement

## 🛠️ Development

### Available Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start development server           |
| `npm run build`     | Build for production               |
| `npm run start`     | Start production server            |
| `npm run check`     | Run TypeScript type checking       |
| `npm run db:push`   | Push schema changes to database    |
| `npm run db:setup`  | Set up database from scratch       |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

### Database Management

#### Schema Changes

1. Edit the schema in `shared/schema.ts`
2. Push changes to database:
   ```bash
   npm run db:push
   ```

#### Database Studio

View and edit your database with Drizzle Studio:

```bash
npm run db:studio
```

### Code Organization

#### Shared Types

All database schemas and TypeScript types are defined in `shared/schema.ts`:

```typescript
import type { TaskWithCompletion, DailySummary } from "@shared/schema";
```

#### API Layer

- Routes are defined in `server/routes.ts`
- Database operations go through `server/storage.ts`
- All requests use Zod validation schemas

#### Component Patterns

- Import shadcn components: `import { Button } from "@/components/ui/button"`
- Use React Query for server state: `useQuery({ queryKey: ["/api/tasks"] })`
- Follow the compound component pattern for cards and dialogs

## 🎨 Design System

BloomDaily uses a carefully crafted design system with:

- **Color Palette**: Warm yellows, soft grays, and gentle accent colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible, reusable UI components via shadcn/ui

Detailed design guidelines are available in `design_guidelines.md`.

## 🚀 Deployment

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Update `DATABASE_URL` to your production database
3. Set a secure `SESSION_SECRET`
4. Configure your hosting platform to serve on the specified `PORT`

### Build Process

```bash
npm run build
npm run start
```

The build process:

1. Builds the React client with Vite
2. Bundles the Express server with esbuild
3. Outputs everything to the `dist/` directory

## 📊 Database Schema

### Tables

- **tasks**: Habit definitions with scheduling information
- **completions**: Records of completed habits by date
- **achievements**: Milestone badges earned for streaks

### Key Relationships

- Tasks have many completions (one per completion date)
- Tasks have many achievements (earned at streak milestones)
- Achievements reference the task and streak count when earned

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code patterns and architecture
- Use TypeScript throughout
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Radix UI** for accessible primitives
- **Drizzle ORM** for type-safe database operations
- **TanStack Query** for excellent server state management

---

Built with ❤️ for daily habit cultivation and personal growth.
