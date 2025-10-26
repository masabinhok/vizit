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

| Bubble Sort | B-Tree | Stack |
|-------------|--------|-------|
| ![Bubble Sort Demo](#) | ![B-Tree Demo](#) | ![Stack Demo](#) |

---

## 🚀 Features

### 🔥 Currently Implemented

#### **Sorting Algorithms**
- ✅ **Bubble Sort** - Classic comparison-based sorting with step-by-step visualization
- 🚧 Quick Sort *(Coming Soon)*
- 🚧 Merge Sort *(Coming Soon)*

#### **Data Structures**
- ✅ **Stack** - LIFO operations with push, pop, and peek animations
- ✅ **B-Tree** - Self-balancing tree with configurable minimum degree
- 🚧 Binary Search Tree *(Coming Soon)*
- 🚧 Hash Table *(Coming Soon)*
- 🚧 Queue *(Coming Soon)*
- 🚧 Linked List *(Coming Soon)*

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
│   ├── algorithm/             # Algorithm routes
│   │   ├── [id]/              # Dynamic algorithm pages
│   │   ├── btree/             # B-Tree visualization
│   │   └── stack/             # Stack visualization
│   ├── algorithms/            # Algorithm implementations
│   │   └── bubble-sort.ts     # Bubble sort logic
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
│   ├── algorithms.ts          # Algorithm metadata
│   └── registry.ts            # Algorithm registry
├── contexts/                   # React contexts
│   └── ThemeContext.tsx       # Theme management
├── types/                      # TypeScript definitions
│   └── index.ts
└── public/                     # Static assets
```

---

## 🤝 Contributing

**We love contributions!** Vizit is open-source and welcoming to developers of all skill levels.

### 🎃 Hacktoberfest 2025

Vizit is **Hacktoberfest-friendly**! We've tagged issues with `hacktoberfest`, `good-first-issue`, and `help-wanted` to help you get started.

### How to Contribute

1. **Read** our [Contributing Guide](./CONTRIBUTING.md)
2. **Check** the [Code of Conduct](./CODE_OF_CONDUCT.md)
3. **Find** an issue or propose a new feature
4. **Fork** the repository
5. **Create** a feature branch (`git checkout -b feature/amazing-algorithm`)
6. **Commit** your changes (`git commit -m 'Add QuickSort visualization'`)
7. **Push** to your branch (`git push origin feature/amazing-algorithm`)
8. **Open** a Pull Request

### 🌱 Good First Issues

Looking to contribute but not sure where to start? Check out these beginner-friendly areas:

- 🎨 Add new algorithm visualizations (Merge Sort, Quick Sort, etc.)
- 📚 Improve documentation and code comments
- 🐛 Fix bugs or improve existing visualizations
- ✨ Enhance UI/UX (animations, transitions, accessibility)
- 🧪 Add tests for algorithm implementations
- 🌐 Add internationalization support

See our [Contributing Guide](./CONTRIBUTING.md) for detailed instructions!

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
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Our community guidelines
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
