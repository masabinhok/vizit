# 🎨 Vizit - Interactive Algorithm Visualizer

<div align="center">

**Learn algorithms visually through real-time, interactive animations**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](./CONTRIBUTING.md)

[🚀 Live Demo](#) • [🐛 Report Bug](https://github.com/masabinhok/vizit/issues) • [✨ Request Feature](https://github.com/masabinhok/vizit/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Contributing](#-contributing)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Community](#-community)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🌟 About

Vizit is an educational platform that brings algorithms to life through smooth, interactive visualizations. Perfect for students, educators, and anyone learning computer science fundamentals.

**Why Vizit?**
- 🎯 **Step-by-step execution** with pause/play controls
- 🎨 **Beautiful animations** with dark/light themes
- 📊 **Performance metrics** tracked in real-time
- 🧩 **Multiple algorithms** - sorting, data structures, graphs
- 🎓 **Educational focus** - clear explanations and pseudocode

---

## ✨ Features

### Available Visualizations

**Sorting Algorithms**
- Bubble Sort
- Merge Sort
- Selection Sort

**Math Algorithms**
- Fibonacci
- GCD (Greatest Common Divisor)
- Modular Arithmetic
- Sieve of Eratosthenes
- Prime Factorization

**Data Structures**
- Stack
- Queue
- B-Tree

**Graph Algorithms**
- Breadth-First Search (BFS)
- Maze Generation

**Visualization Controls**
- Step-by-step execution (play, pause, step, reset)
- Speed control
- Code highlighting
- Custom input
- Responsive design
- Dark/Light themes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/masabinhok/vizit.git
cd vizit

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

**We welcome contributions from developers of all skill levels!** 

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

📚 **Read our [Contributing Guide](./CONTRIBUTING.md)** for detailed instructions.

### Good First Issues

Perfect for first-time contributors:

- 🎨 **Add new algorithms** - Follow our [Adding Algorithms Guide](./docs/ADDING_ALGORITHMS.md)
- 📚 **Improve documentation** - Add comments, fix typos, clarify instructions
- 🐛 **Fix bugs** - Check our [issue tracker](https://github.com/masabinhok/vizit/issues)
- ✨ **Enhance UI/UX** - Improve animations, accessibility, or design
- 🧪 **Add tests** - Help us improve code quality

**Look for issues labeled:** `good-first-issue`, `help-wanted`, `hacktoberfest`

### Development Guidelines

- **Code Style:** We use ESLint and Prettier - run `npm run lint` before committing
- **TypeScript:** All code must be type-safe
- **Commits:** Use conventional commits (e.g., `feat:`, `fix:`, `docs:`)
- **Testing:** Test your changes thoroughly before submitting

---

## 📁 Project Structure

```
vizit/
├── app/
│   ├── algorithm/
│   │   ├── bfs/
│   │   ├── binary-search/
│   │   ├── btree/
│   │   ├── bubble-sort/
│   │   ├── fibonacci/
│   │   ├── gcd/
│   │   ├── maze-generation/
│   │   ├── prime-factorization/
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── visualizers/
├── lib/
│   └── utils/
├── public/
├── docs/
│   ├── CONTRIBUTING.md
│   └── ADDING_ALGORITHMS.md
├── package.json
├── tsconfig.json
└── README.md
```

**Key Architecture:**
- Each algorithm/data structure has its own dedicated page and logic file
- Reusable, type-safe visualization components
- Easy to extend – see [Adding Algorithms Guide](./docs/ADDING_ALGORITHMS.md)

---

## 📖 Documentation

- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Adding Algorithms](./docs/ADDING_ALGORITHMS.md)** - Step-by-step guide for new algorithms
- **[GitHub Discussions](https://github.com/masabinhok/vizit/discussions)** - Ask questions and share ideas

---

## 🗺️ Roadmap

### Coming Soon
- [ ] Quick Sort and Merge Sort improvements
- [ ] Binary Search visualization
- [ ] Graph algorithms (DFS, Dijkstra)
- [ ] Algorithm comparison mode
- [ ] Mobile app support

See [open issues](https://github.com/masabinhok/vizit/issues) for planned features and known bugs.

---

## 💬 Community

- 💬 **Discussions**: [GitHub Discussions](https://github.com/masabinhok/vizit/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/masabinhok/vizit/issues)
- 📧 **Contact**: [masabinhok@gmail.com](mailto:masabinhok@gmail.com)

---

## 🏆 Contributors

Thanks to all our contributors! 🎉

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- Contributors will be automatically listed here -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

**Want to be featured here?** Submit your first PR!

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) for details.

---

## ⭐ Show Your Support

If Vizit helps you learn algorithms:
- ⭐ Star this repository
- 🔀 Fork and contribute
- 📢 Share with your learning community
- 💬 Give us feedback

---

<div align="center">

**Made with 💙 by the open source community**

[⬆ Back to Top](#-vizit---interactive-algorithm-visualizer)

</div>