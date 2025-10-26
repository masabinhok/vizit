# 📚 Vizit Documentation

Welcome to the Vizit documentation! Here you'll find everything you need to understand, use, and contribute to Vizit.

## 📖 Available Documentation

### For Contributors

- **[Adding Algorithms Guide](./ADDING_ALGORITHMS.md)** ⭐ **Start here!**
  - Step-by-step guide for adding new algorithms
  - Code examples for sorting algorithms and data structures
  - Component architecture overview
  - Testing and best practices

- **[Contributing Guide](../CONTRIBUTING.md)**
  - How to contribute to Vizit
  - Development workflow
  - Code style guidelines
  - Pull request process

### Project Information

- **[Main README](../README.md)**
  - Project overview and features
  - Installation instructions
  - Tech stack and roadmap

### Coming Soon

- **Architecture Guide** - Technical deep dive into Vizit's architecture
- **API Reference** - Component and function documentation
- **Testing Guide** - How to write and run tests
- **Deployment Guide** - Deploying Vizit to production

## 🚀 Quick Links

### Want to Add a New Algorithm?
👉 [Adding Algorithms Guide](./ADDING_ALGORITHMS.md)

### Want to Contribute?
👉 [Contributing Guide](../CONTRIBUTING.md)

### Need Help?
- 💬 [GitHub Discussions](https://github.com/masabinhok/vizit/discussions)
- 🐛 [GitHub Issues](https://github.com/masabinhok/vizit/issues)
- 📧 Email: [masabinhok@gmail.com](mailto:masabinhok@gmail.com)

## 📁 File Structure

After the recent refactoring, Vizit uses dedicated pages for each algorithm:

```
app/
  algorithm/
    ├── bubble-sort/page.tsx    # Dedicated Bubble Sort page
    ├── stack/page.tsx          # Dedicated Stack page
    ├── btree/page.tsx          # Dedicated B-Tree page
    └── layout.tsx              # Shared layout with sidebar
```

Each algorithm is self-contained with its own page, making it easier to:
- Debug issues
- Add new features
- Understand the codebase
- Optimize for SEO

## 🎯 Recent Changes

### October 2025 - Architecture Refactoring

We've refactored the app to use **dedicated pages** instead of dynamic routing:

**Before:**
- Single dynamic route: `app/algorithm/[id]/page.tsx`
- Algorithms loaded via registry lookup

**After:**
- Dedicated page per algorithm: `app/algorithm/{algorithm-name}/page.tsx`
- Direct imports, better code organization
- Easier to add new algorithms

See the [Adding Algorithms Guide](./ADDING_ALGORITHMS.md) for the new workflow!

---

<div align="center">

**Made with 💙 by the Vizit Community**

[⬆ Back to Main README](../README.md)

</div>
