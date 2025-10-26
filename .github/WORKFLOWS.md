# 🤖 GitHub Actions Workflows Documentation

This document provides detailed information about all GitHub Actions workflows configured for the Vizit project.

## 📋 Table of Contents

- [Overview](#overview)
- [Core Workflows](#core-workflows)
  - [CI (Continuous Integration)](#ci-continuous-integration)
  - [Format Check](#format-check)
  - [Deploy](#deploy)
- [Community Workflows](#community-workflows)
  - [Greetings](#greetings)
  - [Auto Label](#auto-label)
  - [Auto Merge](#auto-merge)
- [Security & Maintenance](#security--maintenance)
  - [CodeQL Security Analysis](#codeql-security-analysis)
  - [Dependabot](#dependabot)
- [Configuration Files](#configuration-files)
- [Setup Instructions](#setup-instructions)

---

## Overview

Vizit uses GitHub Actions to automate:
- ✅ Code quality checks (linting, type-checking)
- 🏗️ Build verification
- 🚀 Deployment to Vercel
- 🔒 Security scanning
- 📦 Dependency updates
- 💬 Community engagement

All workflows are designed to be:
- **Fast** - Using caching and parallel jobs
- **Reliable** - Comprehensive checks before merging
- **Contributor-friendly** - Clear feedback and helpful messages

---

## Core Workflows

### CI (Continuous Integration)

**File:** `.github/workflows/ci.yml`

**Purpose:** Ensures all code changes meet quality standards before merging.

**Triggers:**
- All pull requests to `main`
- All pushes to `main`

**Jobs:**

1. **Lint** - ESLint code quality checks
   - Validates TypeScript/JavaScript code style
   - Catches common errors and anti-patterns
   - Uses npm caching for speed

2. **Type Check** - TypeScript compilation
   - Runs `tsc --noEmit` to verify types
   - Catches type errors before runtime
   - Ensures type safety across the codebase

3. **Build** - Production build verification
   - Builds Next.js application with Turbopack
   - Uploads build artifacts for inspection
   - Ensures deployability

4. **All Checks** - Final verification
   - Confirms all previous jobs passed
   - Single source of truth for PR status

**Concurrency:** Cancels in-progress runs when new commits are pushed.

**Caching:** npm dependencies cached using `actions/setup-node`.

---

### Format Check

**File:** `.github/workflows/format.yml`

**Purpose:** Enforces consistent code formatting across the project.

**Triggers:**
- Pull requests modifying `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, or `.css` files

**Features:**
- Runs ESLint to check formatting
- Comments on PR if formatting issues found
- Provides helpful error messages

**Why Separate?** Keeps CI workflow focused on core checks while providing specific formatting feedback.

---

### Deploy

**File:** `.github/workflows/deploy.yml`

**Purpose:** Automatically deploys to Vercel after successful CI.

**Triggers:**
- Pushes to `main` branch
- Successful completion of CI workflow

**Requirements:**
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

**Setup:**
1. Get Vercel token from [Vercel account settings](https://vercel.com/account/tokens)
2. Get org/project IDs from `.vercel/project.json`
3. Add as repository secrets in GitHub

**Features:**
- Only deploys if CI passes
- Builds with production optimizations
- Creates deployment summary
- Disables Next.js telemetry

---

## Community Workflows

### Greetings

**File:** `.github/workflows/greetings.yml`

**Purpose:** Welcomes first-time contributors to create a friendly community.

**Triggers:**
- First-time issue creation
- First-time pull request

**Messages Include:**
- Welcome and appreciation
- Links to contributing guidelines
- Pointers to good first issues
- Hacktoberfest information (if applicable)

**Permissions:** Requires write access to issues and pull requests.

---

### Auto Label

**File:** `.github/workflows/label.yml`

**Purpose:** Automatically categorizes issues and PRs for better organization.

**Triggers:**
- New or edited issues
- New, edited, or synchronized pull requests

**Labeling Strategy:**

**Content-based labels:**
- Analyzes title and body text
- Detects keywords like "bug", "feature", "docs", etc.
- Labels: `bug`, `enhancement`, `documentation`, `ui/ux`, `security`, etc.

**File-based labels (PRs only):**
- Analyzes changed files
- Labels based on directories modified
- Examples: `components`, `algorithm`, `ci/cd`, `dependencies`

**Intelligence:**
- Removes duplicate labels
- Combines multiple labeling strategies
- Provides detailed logging

---

### Auto Merge

**File:** `.github/workflows/auto-merge.yml`

**Purpose:** Automatically merges approved PRs when all checks pass.

**Triggers:**
- PR review submission
- Check suite completion

**Requirements:**
- PR must be approved by a maintainer
- All CI checks must pass
- PR must have `automerge` label
- PR must NOT have `work-in-progress` or `do-not-merge` labels

**Merge Strategy:**
- Method: Squash merge
- Commit message: PR title and description
- Retries: 6 attempts with 10s delay

**Safety:**
- Multiple verification steps
- Only merges when explicitly approved
- Maintains commit history cleanliness

---

## Security & Maintenance

### CodeQL Security Analysis

**File:** `.github/workflows/codeql.yml`

**Purpose:** Scans codebase for security vulnerabilities and code quality issues.

**Triggers:**
- Pull requests to `main`
- Pushes to `main`
- Weekly schedule (Mondays at 6:00 AM UTC)

**Features:**
- GitHub's semantic code analysis engine
- Detects common vulnerabilities:
  - SQL injection
  - Cross-site scripting (XSS)
  - Command injection
  - Path traversal
  - And more...

**Query Set:** `security-and-quality` (comprehensive analysis)

**Languages:** TypeScript/JavaScript

**Results:**
- Available in Security tab
- Integrated with pull request checks
- Uploaded as artifacts for 5 days

---

### Dependabot

**File:** `.github/dependabot.yml`

**Purpose:** Keeps dependencies up-to-date with automated PRs.

**Schedule:** Every Monday at 6:00 AM UTC

**Ecosystems:**

1. **npm dependencies**
   - Checks all package.json dependencies
   - Groups related updates (Next.js, React, TypeScript, etc.)
   - Limits to 10 open PRs at a time

2. **GitHub Actions**
   - Updates workflow actions
   - Ensures latest security patches
   - Limits to 5 open PRs at a time

**PR Configuration:**
- Commit prefix: `chore(deps)` or `chore(ci)`
- Labels: `dependencies`, `automated`
- Versioning strategy: Increase
- Auto-rebase when needed

**Grouped Updates:**
- `nextjs` - Next.js and ESLint config
- `react` - React and type definitions
- `typescript` - TypeScript and @types packages
- `tailwind` - Tailwind CSS and PostCSS
- `eslint` - ESLint and plugins

---

## Configuration Files

### CODEOWNERS

**File:** `.github/CODEOWNERS`

**Purpose:** Defines default reviewers for different parts of the codebase.

**Current Owner:** @masabinhok

**Coverage:**
- All files by default
- Workflows and CI/CD
- Documentation
- Algorithm implementations
- Components
- Configuration files

**Usage:** Automatically requests review from owners when files are modified.

---

### Pull Request Template

**File:** `.github/PULL_REQUEST_TEMPLATE.md`

**Sections:**
- Description of changes
- Type of change (bug, feature, docs, etc.)
- Testing details
- Screenshots (for UI changes)
- Workflow summaries (if applicable)
- Documentation updates
- Checklist
- Related issues
- Hacktoberfest confirmation

**Purpose:** Ensures all PRs provide necessary context and follow standards.

---

### Issue Templates

**Directory:** `.github/ISSUE_TEMPLATE/`

**Templates:**

1. **Bug Report** (`bug_report.md`)
   - Bug description
   - Reproduction steps
   - Expected vs actual behavior
   - Environment details
   - Screenshots

2. **Feature Request** (`feature_request.md`)
   - Feature description
   - Problem statement
   - Proposed solution
   - Use cases
   - Benefits

3. **Algorithm Request** (`algorithm_request.md`)
   - Algorithm information
   - Complexity analysis
   - Visualization ideas
   - Resources
   - Contribution willingness

**Config** (`config.yml`)
- Links to discussions
- Contributing guidelines
- Hacktoberfest information

---

## Setup Instructions

### For Repository Owner

1. **Enable GitHub Actions:**
   - Already enabled for public repos
   - Check Settings → Actions → General

2. **Configure Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add Vercel secrets (for deployment):
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

3. **Enable Dependabot:**
   - Already enabled with `dependabot.yml`
   - Check Security → Dependabot

4. **Enable CodeQL:**
   - Go to Security → Code scanning
   - Should auto-enable with workflow

5. **Create Labels:**
   Create these labels in Issues tab:
   - `algorithm` (blue)
   - `bug` (red)
   - `documentation` (light blue)
   - `enhancement` (green)
   - `good first issue` (purple)
   - `help wanted` (green)
   - `hacktoberfest` (orange)
   - `ui/ux` (pink)
   - `security` (red)
   - `dependencies` (gray)
   - `automerge` (yellow)
   - `work-in-progress` (yellow)
   - `do-not-merge` (red)

### For Contributors

1. **Fork the repository**
2. **Workflows run automatically** on your fork
3. **No setup needed** for most workflows
4. **Deployment workflow** won't work without Vercel secrets (optional)

### For New Maintainers

1. **Update CODEOWNERS:**
   - Add your GitHub username to relevant sections
   
2. **Configure Notifications:**
   - Watch the repository
   - Subscribe to relevant workflow runs

3. **Review Dependabot PRs:**
   - Check weekly dependency updates
   - Merge after reviewing changes

4. **Monitor Security:**
   - Check CodeQL alerts
   - Review security advisories

---

## Best Practices

### For All Contributors

✅ **DO:**
- Wait for CI to pass before requesting review
- Fix linting errors locally before pushing
- Add meaningful commit messages
- Test changes thoroughly
- Update documentation if needed

❌ **DON'T:**
- Force push to PR branches (breaks CI)
- Ignore failing checks
- Merge without approval
- Skip testing

### For Maintainers

✅ **DO:**
- Review Dependabot PRs weekly
- Monitor CodeQL security alerts
- Use `automerge` label for trusted contributors
- Keep workflows updated
- Document workflow changes

❌ **DON'T:**
- Merge failing PRs
- Ignore security alerts
- Skip code review
- Modify workflows without testing

---

## Troubleshooting

### Common Issues

**CI failing with "npm ci" error:**
- Solution: Delete `package-lock.json` and run `npm install` locally
- Commit the new lock file

**CodeQL timeout:**
- Solution: Normal for first run, subsequent runs are faster
- Check if build is hanging

**Dependabot PRs failing:**
- Solution: Review breaking changes in dependencies
- May need code updates for major version bumps

**Auto-merge not working:**
- Check if `automerge` label is applied
- Ensure all checks passed
- Verify PR is approved

**Deployment failing:**
- Verify Vercel secrets are set correctly
- Check Vercel project exists
- Review build logs

### Getting Help

- 💬 [GitHub Discussions](https://github.com/masabinhok/vizit/discussions)
- 🐛 [GitHub Issues](https://github.com/masabinhok/vizit/issues)
- 📧 Email: masabinhok@gmail.com

---

## Workflow Badges

Add these to your README to show workflow status:

```markdown
![CI](https://github.com/masabinhok/vizit/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/masabinhok/vizit/actions/workflows/codeql.yml/badge.svg)
![Deploy](https://github.com/masabinhok/vizit/actions/workflows/deploy.yml/badge.svg)
```

---

## Contributing to Workflows

Want to improve our CI/CD? Great!

1. **Test locally** if possible (act tool)
2. **Document changes** in this file
3. **Update README** if user-facing
4. **Add comments** in YAML files
5. **Test on a fork** before opening PR

---

**Last Updated:** October 26, 2025

**Maintained by:** @masabinhok and contributors

**License:** MIT
