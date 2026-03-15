# Portfolio Website - Project Context

## Project Overview

This is a personal portfolio website for **Mubashir Rehman**, a Backend-focused Software Engineer specializing in AI/ML, Cloud, and Systems. The site showcases projects, experience, publications, hobbies, and a technical journal.

**Tech Stack:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with vite-react-ssg (Static Site Generation)
- **UI Library:** shadcn/ui components
- **Styling:** Tailwind CSS with custom theme
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library

## Project Structure

```
portfolio-website/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui base components
│   │   ├── Navbar.tsx   # Navigation bar
│   │   ├── Footer.tsx   # Site footer
│   │   ├── SEO.tsx      # SEO metadata component
│   │   ├── ThemeProvider.tsx  # Dark/light theme
│   │   └── ...
│   ├── pages/           # Route pages
│   │   ├── Landing.tsx  # Home page
│   │   ├── About.tsx    # About/Bio page
│   │   ├── Projects.tsx # Projects showcase
│   │   ├── Contact.tsx  # Contact form
│   │   ├── Journal.tsx  # Technical journal
│   │   ├── Habits.tsx   # Habit tracking
│   │   ├── Hobbies.tsx  # Hobbies (anime, books)
│   │   └── NotFound.tsx # 404 page
│   ├── data/            # JSON data files
│   │   ├── profile.json # Personal info, skills, experience
│   │   ├── projects.json
│   │   ├── journal.json
│   │   ├── habits.json
│   │   ├── books.json
│   │   ├── anime.json
│   │   └── fortyRules.json
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── test/            # Test files
├── public/              # Static assets
├── resume/              # Resume files
│   └── resume.yaml
├── attached_assets/     # Uploaded/media assets
├── dist/                # Build output
└── .github/             # GitHub workflows
```

## Building and Running

### Prerequisites
- Node.js (v18+) and npm/bun installed
- Package manager: npm (bun.lock also present)

### Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:5000)
npm run dev

# Build for production (SSG)
npm run build

# Build for development mode
npm run build:dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Routes

The following routes are pre-rendered via SSG:
- `/` - Landing page
- `/about` - About/Bio
- `/projects` - Projects showcase
- `/hobbies` - Hobbies (anime, books)
- `/habits` - Habit tracking
- `/journal` - Technical journal
- `/contact` - Contact form

## Development Conventions

### Code Style
- **TypeScript:** Strict typing with some relaxed rules (`noImplicitAny: false`, `strictNullChecks: false`)
- **Path Aliases:** `@/*` resolves to `./src/*`
- **Component Naming:** PascalCase for components (e.g., `Typewriter.tsx`, `AnimatedCounter.tsx`)
- **File Naming:** PascalCase for React components, descriptive names for data files

### Architecture Patterns
- **Page Components:** Each route has a dedicated page component in `src/pages/`
- **Data-Driven:** Content stored in JSON files under `src/data/` for easy updates
- **Component Composition:** Heavy use of shadcn/ui primitives with custom wrappers
- **Animation:** Framer Motion for page transitions and micro-interactions
- **SEO:** Dedicated `SEO.tsx` component using `react-helmet-async`

### Key Configuration Files
- `vite.config.ts` - Vite build config with SSG settings
- `tailwind.config.ts` - Tailwind theme customization (fonts, colors, animations)
- `tsconfig.json` - TypeScript configuration with path aliases
- `components.json` - shadcn/ui configuration
- `vitest.config.ts` - Testing configuration

### Design System
- **Fonts:** Playfair Display (headings), DM Sans (body)
- **Colors:** CSS variables with shadcn/ui pattern + custom purple accent
- **Dark Mode:** Supported via `next-themes`
- **Animations:** Custom keyframes for typewriter, scroll indicator, accordion

## Content Management

To update portfolio content, edit the JSON files in `src/data/`:
- `profile.json` - Main bio, skills, experience, education, publications
- `projects.json` - Project listings
- `journal.json` - Journal entries
- `habits.json` - Habit definitions
- `books.json` / `anime.json` - Hobby content

## Testing

Tests are located in `src/test/` and use:
- **Vitest** as the test runner
- **React Testing Library** for component testing
- **jsdom** for DOM environment

Run tests with `npm test` or `npm run test:watch` for development.

## Deployment

The project is configured for deployment via:
1. **Lovable Platform:** Secondary deployment target (configured in vite.config.ts)
2. **GitHub Pages:** Primary via standard SSG build output in `dist/public`

Build output is configured to `dist/public` directory.
