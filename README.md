# 🎨 Vizit - Interactive Algorithm Visualizer

<div align="center">

![Vizit Banner](https://img.shields.io/badge/Vizit-Algorithm%20Visualizer-blue?style=for-the-badge&logo=react)

**Learn algorithms visually through real-time, interactive animations**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-Friendly-orange?style=flat-square)](https://hacktoberfest.com/)

[🚀 Live Demo](#) • [📖 Documentation](./CONTRIBUTING.md) • [🐛 Report Bug](https://github.com/masabinhok/vizit/issues) • [✨ Request Feature](https://github.com/masabinhok/vizit/issues)

</div>

---
<details>
  <summary><h2>📚 Table of Contents</h2></summary>

1. [🌟 About Vizit](#-about-vizit)  
2. [✨ Why Vizit?](#-why-vizit)  
3. [🎥 Demo](#-demo)  
4. [🚀 Features](#-features)  
   - [🔥 Currently Implemented](#-currently-implemented)  
   - [🎨 Visualization Features](#-visualization-features)  
5. [🛠️ Tech Stack](#️-tech-stack)  
   - [Architecture Highlights](#architecture-highlights)  
6. [📦 Installation](#-installation)  
   - [Prerequisites](#prerequisites)  
   - [Quick Start](#quick-start)  
   - [Build for Production](#build-for-production)  
7. [🎯 Usage](#-usage)  
   - [Using Vizit](#using-vizit)  
   - [Project Structure](#project-structure)  
8. [🤝 Contributing](#-contributing)  
   - [🎃 Hacktoberfest 2025](#-hacktoberfest-2025)  
   - [How to Contribute](#how-to-contribute)  
   - [🌱 Good First Issues](#-good-first-issues)  
9. [🧩 GitHub Actions Setup](#-github-actions-setup)  
   - [🤖 Automated Workflows](#-automated-workflows)  
   - [🎯 Workflow Status Badges](#-workflow-status-badges)  
   - [🛠️ Setting Up for Your Fork](#-setting-up-for-your-fork)  
   - [📊 Benefits](#-benefits)  
10. [🗺️ Roadmap](#️-roadmap)  
11. [📖 Documentation](#-documentation)  
12. [🏆 Contributors](#-contributors)  
13. [📄 License](#-license)  
14. [💬 Community & Support](#-community--support)  
15. [🙏 Acknowledgments](#-acknowledgments)  
16. [⭐ Show Your Support](#-show-your-support)  

</details>

---

## 🌟 About Vizit

**Vizit** (Visualize It) is an educational platform that brings algorithms to life through **smooth, GPU-accelerated animations** and **interactive visualizations**. Perfect for students, educators, and anyone curious about how algorithms work under the hood.

### ✨ Why Vizit?

- 🎯 **Real-time visualization** - Watch algorithms execute step-by-step with beautiful animations
- 🎨 **Interactive controls** - Pause, play, adjust speed, and navigate through each step
- 🌓 **Dark/Light themes** - Beautiful UI that adapts to your preference
- 📊 **Performance metrics** - Track comparisons, swaps, and complexity in real-time
- 🧩 **Multiple data structures** - From sorting algorithms to trees and graphs
- 🎓 **Educational focus** - Clear explanations and pseudocode for every algorithm

---

## 🎥 Demo

> **Coming Soon:** Screenshots and GIFs showcasing Vizit in action!

| Bubble Sort | Merge Sort | B-Tree | Stack | Queue |
|-------------|------------|--------| ----- | ----- |
| ![Bubble Sort Demo](#) | ![Merge Sort Demo](#) | ![B-Tree Demo](#) | ![Stack Demo](#) | ![Queue Demo](#) |

---

## 🚀 Features

### 🔥 Currently Implemented

#### **Sorting Algorithms**
- ✅ **Bubble Sort** - Classic comparison-based sorting with step-by-step visualization
- ✅ **Merge Sort** - Efficient divide-and-conquer sorting algorithm with interactive demo
- 🚧 Quick Sort *(Coming Soon)*

#### **Data Structures**
- ✅ **Stack** - LIFO operations with push, pop, and peek animations
- ✅ **Queue** - FIFO operations with enqueue, dequeue, and peek animations
- ✅ **B-Tree** - Self-balancing tree with configurable minimum degree
- 🚧 Binary Search Tree *(Coming Soon)*
- 🚧 Hash Table *(Coming Soon)*
- 🚧 Queue *(Coming Soon)*
- 🚧 Linked List *(Coming Soon)*

#### **Graph**
- ✅ **Breadth-First Search (BFS)** - Explore Graphs Level-by-Level to Find Shortest Paths
- 🚧 Depth-first Search (DFS) *(Coming Soon)*
- 🚧 Kruskal's MST *(Coming Soon)*
- 🚧 Prim's MST *(Coming Soon)*
- 🚧 Topological Sort *(Coming Soon)*

### 🎨 Visualization Features

- **Step-by-step execution** with pause/play controls
- **Variable speed control** (100ms - 2000ms delay)
- **Code highlighting** synchronized with visualization
- **Performance statistics** (comparisons, swaps, time/space complexity)
- **Custom input** - Test with your own data
- **Responsive design** - Works on desktop and tablet

---

## 🛠️ Tech Stack

Vizit is built with modern web technologies for optimal performance:

| Technology | Purpose |
|-----------|---------|
| **Next.js 15.5** | React framework with App Router and Turbopack |
| **React 19.1** | UI components with hooks and context |
| **TypeScript 5.x** | Type-safe code for better DX |
| **Tailwind CSS 4.x** | Utility-first styling with custom animations |
| **IBM Plex Sans/Mono** | Beautiful, accessible typography |

### Architecture Highlights

- **Component-based architecture** with reusable visualization components
- **Registry pattern** for algorithm configurations
- **Context API** for theme management
- **Custom hooks** for animation control
- **Modular algorithm implementations** - Easy to extend!

---

## 📦 Installation

### Prerequisites

- **Node.js** 20.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/masabinhok/vizit.git
   cd vizit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see Vizit in action!

### Build for Production

```bash
npm run build
npm run start
```

---

## 🎯 Usage

### Using Vizit

1. **Select an algorithm** from the sidebar
2. **Enter custom input** or use the default values
3. **Click "Initialize"** to generate the visualization steps
4. **Control playback** with play/pause, speed adjustment, or manual stepping
5. **Learn** by reading the synchronized code and explanations

### Project Structure

```
vizit/
├── app/                        # Next.js App Router
│   ├── algorithm/             # Algorithm routes (each has own page)
│   │   ├── bubble-sort/       # Bubble Sort visualization
│   │   ├── btree/             # B-Tree visualization
│   │   ├── stack/             # Stack visualization
│   │   └── layout.tsx         # Shared algorithm layout
│   ├── algorithms/            # Algorithm implementations
│   │   └── bubble-sort.ts     # Bubble sort logic & config
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                 # React components
│   ├── BTreeVisualization.tsx
│   ├── ControlBar.tsx
│   ├── InfoPanel.tsx
│   ├── Sidebar.tsx
│   ├── StackVisualization.tsx
│   ├── ThemeToggle.tsx
│   └── VisualizationCanvas.tsx
├── constants/                  # Configuration files
│   ├── algorithms.ts          # Algorithm metadata & categories
│   └── registry.ts            # Algorithm registry (reference)
├── contexts/                   # React contexts
│   └── ThemeContext.tsx       # Theme management
├── types/                      # TypeScript definitions
│   └── index.ts
├── docs/                       # Documentation
│   └── ADDING_ALGORITHMS.md   # Guide for adding algorithms
└── public/                     # Static assets
```

**Architecture Highlights:**
- ✨ **Dedicated pages** - Each algorithm has its own route (no dynamic routing)
- 🧩 **Component-based** - Reusable visualization components
- 📝 **Type-safe** - Full TypeScript support
- 🎨 **Modular** - Easy to add new algorithms ([see guide](./docs/ADDING_ALGORITHMS.md))

---

## 🤝 Contributing

**We love contributions!** Vizit is open-source and welcoming to developers of all skill levels.

### 🎃 Hacktoberfest 2025

Vizit is **Hacktoberfest-friendly**! We've tagged issues with `hacktoberfest`, `good-first-issue`, and `help-wanted` to help you get started.

### How to Contribute

1. **Read** our [Contributing Guide](./CONTRIBUTING.md)
2. **Find** an issue or propose a new feature
3. **Fork** the repository
4. **Create** a feature branch (`git checkout -b feature/amazing-algorithm`)
5. **Commit** your changes (`git commit -m 'Add QuickSort visualization'`)
6. **Push** to your branch (`git push origin feature/amazing-algorithm`)
7. **Open** a Pull Request

### 🌱 Good First Issues

Looking to contribute but not sure where to start? Check out these beginner-friendly areas:

- 🎨 Add new algorithm visualizations (Merge Sort, Quick Sort, etc.) - [See guide](./docs/ADDING_ALGORITHMS.md)
- 📚 Improve documentation and code comments
- 🐛 Fix bugs or improve existing visualizations
- ✨ Enhance UI/UX (animations, transitions, accessibility)
- 🧪 Add tests for algorithm implementations
- 🌐 Add internationalization support

See our [Contributing Guide](./CONTRIBUTING.md) for detailed instructions!

---

## 🧩 GitHub Actions Setup

Vizit uses **GitHub Actions** for continuous integration, automated testing, security scanning, and deployment. Our CI/CD pipeline ensures code quality, security, and smooth releases.

### 🤖 Automated Workflows

#### 🧪 **CI (Continuous Integration)** - `ci.yml`
Runs comprehensive checks on all pull requests and pushes to `main`:
- **Lint** - ESLint checks for code quality and style consistency
- **Type Check** - TypeScript compiler validation
- **Build** - Next.js production build verification
- **Caching** - npm dependencies cached for faster runs

**Triggers:** PRs and pushes to `main`

#### 🎨 **Format Check** - `format.yml`
Enforces consistent code formatting across the codebase:
- Validates ESLint rules on all TypeScript/JavaScript files
- Automatically comments on PRs with formatting issues
- Helps maintain clean, readable code

**Triggers:** Pull requests modifying `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, or `.css` files

#### 🚀 **Deploy** - `deploy.yml`
Automatically deploys to Vercel after successful CI:
- Builds production-ready Next.js application
- Deploys to Vercel hosting platform
- Creates deployment summary with commit details
- Only runs when CI passes successfully

**Triggers:** Pushes to `main` after CI completion  
**Requirements:** Vercel secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)

#### 💬 **Greetings** - `greetings.yml`
Welcomes first-time contributors to the project:
- Greets users opening their first issue
- Welcomes first-time PR contributors
- Provides helpful links to contributing guides
- Highlights good first issues and Hacktoberfest opportunities

**Triggers:** New issues and pull requests from first-time contributors

#### 🏷️ **Auto Label** - `label.yml`
Intelligently categorizes issues and pull requests:
- **Content-based labeling** - Analyzes title and body text
- **File-based labeling** - Detects changes in specific directories
- Labels: `algorithm`, `bug`, `documentation`, `enhancement`, `ui/ux`, `security`, `dependencies`, and more
- Helps maintainers prioritize and organize contributions

**Triggers:** New or edited issues and pull requests

#### 🔒 **CodeQL Security Analysis** - `codeql.yml`
Scans for security vulnerabilities and code quality issues:
- GitHub's advanced semantic code analysis engine
- Detects common security vulnerabilities (SQL injection, XSS, etc.)
- Runs on TypeScript/JavaScript codebase
- Weekly scheduled scans every Monday
- Results visible in Security tab

**Triggers:** PRs, pushes to `main`, and weekly on Mondays at 6:00 AM UTC

#### 📦 **Dependabot** - `dependabot.yml`
Keeps dependencies up-to-date automatically:
- **npm dependencies** - Weekly updates for all packages
- **GitHub Actions** - Weekly updates for workflow actions
- Groups related updates (Next.js, React, TypeScript, Tailwind, ESLint)
- Auto-labels PRs as `dependencies` and `automated`
- Conventional commit messages (`chore(deps)`, `chore(ci)`)

**Schedule:** Every Monday at 6:00 AM UTC

### 🎯 Workflow Status Badges

Add these badges to show workflow status:

```markdown
![CI](https://github.com/masabinhok/vizit/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/masabinhok/vizit/actions/workflows/codeql.yml/badge.svg)
```

### 🛠️ Setting Up for Your Fork

If you fork this repository, you'll need to configure:

1. **Vercel Deployment** (optional):
   - Add repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - Get these from your [Vercel account settings](https://vercel.com/account/tokens)

2. **GitHub Actions**:
   - Automatically enabled for public repositories
   - Check the "Actions" tab to see workflow runs

3. **Dependabot**:
   - Enabled by default with the configuration file
   - Review and merge dependency update PRs regularly

### 📊 Benefits

✅ **Quality Assurance** - Catch bugs and issues before merging  
✅ **Security** - Automated vulnerability scanning with CodeQL  
✅ **Consistency** - Enforced code style and formatting  
✅ **Automation** - Less manual work, more coding time  
✅ **Contributor-Friendly** - Clear feedback and welcoming messages  
✅ **Up-to-Date** - Automated dependency updates  

---

## 🗺️ Roadmap

### 🎯 Upcoming Features

#### Q1 2025
- [ ] Quick Sort visualization
- [ ] Merge Sort visualization
- [ ] Binary Search visualization
- [ ] Improved mobile responsiveness
- [ ] Algorithm comparison mode

#### Q2 2025
- [ ] Graph algorithms (BFS, DFS, Dijkstra)
- [ ] Dynamic programming visualizations
- [ ] Custom algorithm builder
- [ ] Save/share visualizations
- [ ] Tutorial mode for beginners

#### Future
- [ ] WebAssembly for performance-critical algorithms
- [ ] Collaborative learning features
- [ ] Algorithm challenges and quizzes
- [ ] AI-powered explanations

---

## 📖 Documentation

- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to Vizit
- **[Adding Algorithms Guide](./docs/ADDING_ALGORITHMS.md)** - Step-by-step guide for adding new algorithms
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Technical deep dive *(Coming Soon)*
- **[API Reference](./docs/API.md)** - Component and function docs *(Coming Soon)*

---

## 🏆 Contributors

Thank you to all our amazing contributors! 🎉

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- This section will be automatically generated -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Want to see your name here? Check out our [Contributing Guide](./CONTRIBUTING.md)!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 💬 Community & Support

- 💬 **Discussions**: Share ideas and ask questions on [GitHub Discussions](https://github.com/masabinhok/vizit/discussions)
- 🐛 **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/masabinhok/vizit/issues)
- 📧 **Email**: Contact the maintainer at [masabinhok@gmail.com](mailto:masabinhok@gmail.com)

---

## 🙏 Acknowledgments

- Inspired by [VisuAlgo](https://visualgo.net/) and [Algorithm Visualizer](https://algorithm-visualizer.org/)
- Built with ❤️ using [Next.js](https://nextjs.org/), [React](https://reactjs.org/), and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

## ⭐ Show Your Support

If you find Vizit helpful, please consider:

- ⭐ **Starring** this repository
- 🔀 **Forking** and contributing
- 📢 **Sharing** with friends and classmates
- 💬 **Providing feedback** through issues

---

<div align="center">

**Made with 💙 by the Vizit Community**

[⬆ Back to Top](#-vizit---interactive-algorithm-visualizer)

</div>
