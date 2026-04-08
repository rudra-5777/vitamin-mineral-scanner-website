# Vitamin & Mineral Scanner Website

A modern, interactive website showcasing a **Vitamin & Mineral Scanner** app with AI/LLM integration. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔬 **Vitamin & Mineral Scanner** – Identify fruits and display nutrient breakdowns using the USDA FoodData Central database with a built-in weight estimator
- 🍌 **Shelf Life & Ripeness Detection** – Colorimetric analysis to track ripeness and estimate days before spoilage, with push notification mockups
- 🚦 **Disease Compatibility System** – Traffic-light (Red / Yellow / Green) dietary compatibility for conditions like diabetes, chronic kidney disease, and fasting
- 🤖 **AI Agent Training Dashboard** – Add new fruits and disease profiles, run mock predictions, view training metrics, and manage a knowledge base
- 🏗️ **Technology Stack Overview** – Architecture diagram covering React + TypeScript, Supabase, Claude/OpenAI API integration
- 📖 **API Documentation** – Code examples for Supabase, Claude API, nutrition lookup, and ripeness analysis
- 🚀 **Getting Started Guide** – Step-by-step setup instructions for developers

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Routing | react-router-dom v7 |
| Build | Vite 8 |
| Backend (demo) | Supabase + PostgreSQL |
| AI Layer (demo) | Claude API / OpenAI API |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/rudra-5777/vitamin-mineral-scanner-website.git
cd vitamin-mineral-scanner-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory, ready to deploy on Vercel, Netlify, or any static host.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

> **Note:** The website currently uses hardcoded demo data. Connect the environment variables to enable live AI and database calls.

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Sticky navigation with mobile menu
│   ├── Hero.tsx                # Hero / landing section
│   ├── Features.tsx            # Three-feature overview cards
│   ├── ScannerDemo.tsx         # Vitamin & mineral scanner demo
│   ├── RipenessDemo.tsx        # Shelf life & ripeness detection demo
│   ├── DiseaseCompatibility.tsx # Traffic-light disease compatibility
│   ├── AgentDashboard.tsx      # AI agent training dashboard
│   ├── TechStack.tsx           # Technology stack & architecture
│   ├── ApiDocs.tsx             # API documentation & code examples
│   ├── GettingStarted.tsx      # Developer getting-started guide
│   └── Footer.tsx              # Site footer
├── App.tsx                     # Root application component
├── main.tsx                    # Entry point
└── index.css                   # Tailwind CSS base styles
```

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag the dist/ folder to Netlify's dashboard, or use the Netlify CLI
```

## License

MIT
