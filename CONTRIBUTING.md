# 🤝 Contributing to Vizit

First off, **thank you** for considering contributing to Vizit! 🎉 It's people like you who make Vizit a great learning tool for everyone.

This guide will help you get started with contributing, whether you're fixing a typo, adding a new algorithm, or improving the codebase.

---

## 📋 Table of Contents

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

Want to add a new sorting, searching, or graph algorithm? We've got you covered!

**📖 Full Guide:** See our comprehensive [Adding Algorithms Guide](./docs/ADDING_ALGORITHMS.md) for detailed instructions.

### Quick Overview

Each algorithm now has its own dedicated page (no more dynamic routing!). Here's the basic process:

1. **Create algorithm logic** in `app/algorithms/your-algorithm.ts`
2. **Create dedicated page** in `app/algorithm/your-algorithm/page.tsx`
3. **Update metadata** in `constants/algorithms.ts`
4. **Test thoroughly** with various inputs
5. **Submit your PR**!

### Example Structure

```typescript
// app/algorithms/quick-sort.ts
export const quickSortConfig: AlgorithmConfig = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Algorithms',
  description: 'Efficient divide-and-conquer sorting algorithm',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  spaceComplexity: 'O(log n)',
  code: quickSortCode,
  defaultInput: '64,34,25,12,22,11,90',
  generateSteps: generateQuickSortSteps
};
```

Then create `app/algorithm/quick-sort/page.tsx` following the pattern in our guide.

**For complete code examples and best practices, see [docs/ADDING_ALGORITHMS.md](./docs/ADDING_ALGORITHMS.md)**

---

## 🏗️ Adding a New Data Structure

Want to add a Queue, Linked List, or Graph visualization? Here's how:

**📖 Full Guide:** See [Adding Algorithms Guide](./docs/ADDING_ALGORITHMS.md#data-structure-algorithms) for complete examples.

### Quick Overview

1. **Create visualization component** in `components/YourDataStructureVisualization.tsx`
2. **Create dedicated page** in `app/algorithm/your-structure/page.tsx`
3. **Add to metadata** in `constants/algorithms.ts`
4. **Test all operations** (push, pop, insert, delete, etc.)

### Example: Queue Page

```typescript
// app/algorithm/queue/page.tsx
'use client';

import { useTheme } from '../../../contexts/ThemeContext';
import QueueVisualization from '../../../components/QueueVisualization';

export default function QueuePage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900...' : '...'}`}>
      <header>{/* Header with title and complexity info */}</header>
      <section><QueueVisualization /></section>
    </div>
  );
}
```

**For complete examples, see [docs/ADDING_ALGORITHMS.md](./docs/ADDING_ALGORITHMS.md#data-structure-algorithms)**

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
