# 🤝 Contributing to Vizit

First off, **thank you** for considering contributing to Vizit! 🎉 It's people like you who make Vizit a great learning tool for everyone.

This guide will help you get started with contributing, whether you're fixing a typo, adding a new algorithm, or improving the codebase.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Algorithm](#adding-a-new-algorithm)
- [Adding a New Data Structure](#adding-a-new-data-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Hacktoberfest Guidelines](#hacktoberfest-guidelines)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

**TL;DR:** Be respectful, inclusive, and constructive. We're all here to learn and grow together! 🌱

---

## 🎯 How Can I Contribute?

There are many ways to contribute to Vizit:

### 🐛 Reporting Bugs

Found a bug? Help us fix it!

1. **Check** if the bug has already been reported in [Issues](https://github.com/masabinhok/vizit/issues)
2. If not, **create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs. actual behavior
   - Screenshots/GIFs if applicable
   - Your environment (OS, browser, Node version)

### ✨ Suggesting Features

Have an idea to improve Vizit?

1. **Check** existing feature requests in [Issues](https://github.com/masabinhok/vizit/issues)
2. **Create a new issue** with the `enhancement` label
3. Describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Any alternatives you've considered
   - Why this would benefit Vizit users

### 🎨 Contributing Code

Ready to code? Amazing! Here's how:

1. **Find an issue** labeled `good-first-issue` or `help-wanted`
2. **Comment** on the issue to let others know you're working on it
3. **Fork** the repository
4. **Create a branch** from `main`
5. **Make your changes** following our guidelines
6. **Submit a pull request**

### 📚 Improving Documentation

Documentation is crucial! You can help by:

- Fixing typos or unclear explanations
- Adding examples or tutorials
- Improving code comments
- Translating documentation (future feature)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm**, **yarn**, or **pnpm**
- **Git** for version control
- A **code editor** (we recommend VS Code)

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vizit.git
   cd vizit
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/masabinhok/vizit.git
   ```

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your changes in real-time!

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/algorithm-quicksort
# or
git checkout -b fix/bubble-sort-animation
# or
git checkout -b docs/contributing-guide
```

Branch naming conventions:
- `feature/` - New features or algorithms
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `style/` - UI/UX improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 3. Test Locally

Before committing, make sure:

- ✅ The dev server runs without errors
- ✅ Your algorithm visualizes correctly
- ✅ No console errors or warnings
- ✅ The UI is responsive (desktop & tablet)
- ✅ Dark/light themes both work

### 4. Lint Your Code

```bash
npm run lint
```

Fix any linting errors before committing.

### 5. Commit Your Changes

Write clear, descriptive commit messages (see [Commit Guidelines](#commit-message-guidelines)):

```bash
git add .
git commit -m "feat: add QuickSort visualization with pivot highlighting"
```

### 6. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 7. Push to Your Fork

```bash
git push origin feature/algorithm-quicksort
```

### 8. Open a Pull Request

- Go to the original Vizit repository
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Submit!

---

## 🎨 Adding a New Algorithm

Want to add a new sorting, searching, or graph algorithm? Follow these steps:

### Step 1: Create the Algorithm File

Create a new file in `app/algorithms/`:

```typescript
// app/algorithms/quick-sort.ts
import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const quickSortCode = [
  "function quickSort(arr, low, high) {",
  "  if (low < high) {",
  "    let pi = partition(arr, low, high);",
  "    quickSort(arr, low, pi - 1);",
  "    quickSort(arr, pi + 1, high);",
  "  }",
  "}",
];

const generateQuickSortSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  // Your step generation logic here
  return steps;
};

export const quickSortConfig: AlgorithmConfig = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Algorithms',
  description: 'Efficient divide-and-conquer sorting algorithm',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(log n)',
  code: quickSortCode,
  defaultInput: '64,34,25,12,22,11,90',
  generateSteps: generateQuickSortSteps
};
```

### Step 2: Register the Algorithm

Add it to `constants/registry.ts`:

```typescript
import { quickSortConfig } from '../app/algorithms/quick-sort';

export const ALGORITHM_REGISTRY: Record<string, AlgorithmConfig> = {
  'bubble-sort': bubbleSortConfig,
  'quick-sort': quickSortConfig, // Add here
  // ... other algorithms
};
```

### Step 3: Add to Metadata

Update `constants/algorithms.ts`:

```typescript
export const ALGORITHM_CATEGORIES: Category[] = [
  {
    name: "Algorithms",
    algorithms: ["bubble-sort", "quick-sort", "merge-sort", ...]
  },
  // ... other categories
];

export const ALGORITHM_NAME_MAP: Record<string, string> = {
  "bubble-sort": "Bubble Sort",
  "quick-sort": "Quick Sort", // Add here
  // ... other mappings
};
```

### Step 4: Test Your Algorithm

1. Run the dev server: `npm run dev`
2. Navigate to `/algorithm/quick-sort`
3. Test with various inputs
4. Verify step-by-step visualization
5. Check code highlighting
6. Test edge cases (empty array, single element, already sorted, etc.)

### Step 5: Document Your Algorithm

Add explanations in the `generateSteps` function with clear `description` fields for each step.

---

## 🏗️ Adding a New Data Structure

Want to add a Queue, Linked List, or Graph visualization? Here's how:

### Step 1: Create the Visualization Component

Create a new file in `components/`:

```typescript
// components/QueueVisualization.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function QueueVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Your queue logic here
  
  return (
    <div className="flex h-full gap-4">
      {/* Your visualization UI */}
    </div>
  );
}
```

### Step 2: Create a Route

Create a new folder in `app/algorithm/`:

```
app/algorithm/queue/
  └── page.tsx
```

Import and use your component:

```typescript
// app/algorithm/queue/page.tsx
import QueueVisualization from '@/components/QueueVisualization';

export default function QueuePage() {
  return <QueueVisualization />;
}
```

### Step 3: Add to Sidebar

The sidebar should automatically detect the new route if you've added it to the algorithm metadata.

### Step 4: Test Thoroughly

- Test all operations (enqueue, dequeue, peek, etc.)
- Verify animations are smooth
- Check responsive design
- Test dark/light themes

---

## 🎨 Code Style Guidelines

### TypeScript

- Use **TypeScript** for all new code
- Define proper types and interfaces
- Avoid `any` - use specific types
- Use type inference where obvious

```typescript
// ✅ Good
const count: number = steps.length;
const currentElement: ArrayElement = steps[currentStep];

// ❌ Avoid
const count: any = steps.length;
```

### React

- Use **functional components** with hooks
- Prefer `const` over `let` when possible
- Destructure props for clarity
- Use meaningful variable names

```typescript
// ✅ Good
const { resolvedTheme } = useTheme();
const isDarkMode = resolvedTheme === 'dark';

// ❌ Avoid
const theme = useTheme().resolvedTheme;
const dm = theme === 'dark';
```

### Styling

- Use **Tailwind CSS** utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Support both dark and light themes

```typescript
// ✅ Good - Responsive and theme-aware
className={`px-4 py-2 rounded-xl ${
  isDarkMode 
    ? 'bg-slate-800 text-white' 
    : 'bg-white text-gray-900'
}`}
```

### File Organization

- One component per file
- Group related components in folders
- Use index files for cleaner imports
- Keep files under 500 lines when possible

### Comments

- Comment **why**, not **what**
- Use JSDoc for functions/components
- Explain complex algorithms
- Remove commented-out code before committing

```typescript
// ✅ Good
// Split the child because it has reached maximum capacity
await splitChild(parent, index);

// ❌ Avoid
// Split child
await splitChild(parent, index);
```

---

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(algorithm): add QuickSort visualization with partition animation

fix(btree): correct node splitting logic for edge cases

docs(readme): add installation instructions for Windows users

style(ui): improve dark mode contrast for better accessibility

refactor(components): extract common visualization logic to hooks
```

### Best Practices

- Use the imperative mood ("add" not "added")
- Keep the subject line under 50 characters
- Capitalize the subject line
- Don't end the subject with a period
- Use the body to explain **what** and **why**, not **how**

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Documentation is updated (if needed)
- [ ] Commits follow the commit message guidelines
- [ ] Branch is up-to-date with `main`

### PR Template

When you open a PR, fill out the template with:

1. **Description**: What does this PR do?
2. **Type of Change**: Feature, bug fix, docs, etc.
3. **Testing**: How did you test this?
4. **Screenshots**: If UI changes, include before/after
5. **Related Issues**: Link to any related issues

### Review Process

1. **Automated checks** will run (linting, build)
2. A **maintainer will review** your code
3. You may be asked to make changes
4. Once approved, your PR will be **merged**!

### After Your PR is Merged

- Delete your feature branch
- Pull the latest `main` branch
- Celebrate! 🎉 You're now a Vizit contributor!

---

## 🎃 Hacktoberfest Guidelines

Participating in Hacktoberfest? Welcome! Here's what you need to know:

### Quality Over Quantity

We value **meaningful contributions**. Please avoid:

- ❌ Trivial changes (fixing typos in comments)
- ❌ Automated/spam PRs
- ❌ PRs that don't add value

Instead, focus on:

- ✅ Implementing new algorithms
- ✅ Fixing bugs
- ✅ Improving documentation
- ✅ Enhancing UI/UX
- ✅ Adding tests

### Finding Hacktoberfest Issues

Look for issues labeled:
- `hacktoberfest`
- `good-first-issue`
- `help-wanted`

### Hacktoberfest Rules (2025)

- PRs must be submitted during October (we're ready!)
- PRs must be accepted/merged to count
- Spam PRs may be marked as `invalid`
- Read the [official Hacktoberfest rules](https://hacktoberfest.com/participation/)

---

## 💡 Tips for New Contributors

### Start Small

- Fix a typo or improve documentation
- Add comments to existing code
- Improve error messages
- Enhance UI styling

### Ask Questions

- Not sure where to start? Ask in the issue comments
- Need help? Join our discussions
- Stuck? Tag a maintainer

### Learn by Example

- Study existing algorithm implementations
- Check out merged PRs for inspiration
- Follow the patterns in the codebase

### Be Patient

- Reviews may take a few days
- We're all volunteers
- Your contribution is valued!

---

## 📚 Resources

### Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Algorithm Resources

- [VisuAlgo](https://visualgo.net/) - Algorithm visualizations
- [Algorithm Visualizer](https://algorithm-visualizer.org/)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- [GeeksforGeeks](https://www.geeksforgeeks.org/) - Algorithm explanations

---

## 🙏 Thank You!

Your contributions make Vizit better for everyone. Whether you're fixing a small bug or adding a major feature, **every contribution matters**.

Happy coding! 🚀

---

## ❓ Questions?

- 💬 [GitHub Discussions](https://github.com/masabinhok/vizit/discussions)
- 🐛 [GitHub Issues](https://github.com/masabinhok/vizit/issues)
- 📧 Email: [masabinhok@gmail.com](mailto:masabinhok@gmail.com)

---

<div align="center">

**Made with 💙 by the Vizit Community**

[⬆ Back to Top](#-contributing-to-vizit)

</div>
