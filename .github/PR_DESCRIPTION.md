# 🤖 Add Comprehensive GitHub Actions Workflows

## 📝 Description

This PR adds a complete GitHub Actions CI/CD setup to the Vizit repository, making it more contributor-friendly, secure, and automated. Perfect for an open-source, Hacktoberfest-eligible project!

## 🎯 Type of Change

- [x] ✨ New feature (GitHub Actions workflows)
- [x] 📚 Documentation update
- [x] 🔧 Configuration change
- [x] 🤖 CI/CD update

## ℹ️ Summary of Added Workflows

### 🧪 Core Workflows

#### 1. **CI (Continuous Integration)** - `.github/workflows/ci.yml`
- ✅ **Lint** - ESLint code quality checks on all TypeScript/JavaScript files
- ✅ **Type Check** - TypeScript compiler validation (`tsc --noEmit`)
- ✅ **Build** - Next.js production build with Turbopack
- ✅ **Caching** - npm dependencies cached for faster runs
- ✅ **Concurrency** - Cancels outdated workflow runs automatically

**Triggers:** Pull requests and pushes to `main`

#### 2. **Format Check** - `.github/workflows/format.yml`
- ✅ Validates ESLint rules on all code files
- ✅ Automatically comments on PRs with formatting issues
- ✅ Only runs on relevant file changes (`.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.css`)

**Triggers:** Pull requests modifying code files

#### 3. **Deploy** - `.github/workflows/deploy.yml`
- ✅ Automatically deploys to Vercel after successful CI
- ✅ Production build with optimizations
- ✅ Creates deployment summary
- ✅ Only runs when CI passes

**Triggers:** Pushes to `main` after CI success  
**Requirements:** Vercel secrets (see setup docs)

### 💬 Community Workflows

#### 4. **Greetings** - `.github/workflows/greetings.yml`
- ✅ Welcomes first-time issue creators
- ✅ Greets first-time PR contributors
- ✅ Provides helpful links to contributing guides
- ✅ Highlights good first issues and Hacktoberfest

**Triggers:** New issues and PRs from first-time contributors

#### 5. **Auto Label** - `.github/workflows/label.yml`
- ✅ **Content-based labeling** - Analyzes issue/PR title and body
- ✅ **File-based labeling** - Detects changes in specific directories
- ✅ **Smart categorization** - 20+ label types
- ✅ Labels: `algorithm`, `bug`, `documentation`, `enhancement`, `ui/ux`, `security`, `dependencies`, etc.

**Triggers:** New or edited issues and pull requests

#### 6. **Auto Merge** - `.github/workflows/auto-merge.yml`
- ✅ Automatically merges approved PRs when all checks pass
- ✅ Requires `automerge` label and maintainer approval
- ✅ Squash merge with PR title and description
- ✅ Safety checks (blocks `work-in-progress` and `do-not-merge` labels)

**Triggers:** PR reviews and check suite completions

### 🔒 Security & Maintenance

#### 7. **CodeQL Security Analysis** - `.github/workflows/codeql.yml`
- ✅ GitHub's semantic code analysis for security vulnerabilities
- ✅ Detects: SQL injection, XSS, command injection, path traversal, etc.
- ✅ Runs on TypeScript/JavaScript codebase
- ✅ Weekly scheduled scans (Mondays at 6:00 AM UTC)
- ✅ Results visible in Security tab

**Triggers:** PRs, pushes to `main`, and weekly schedule

#### 8. **Dependabot** - `.github/dependabot.yml`
- ✅ **npm dependencies** - Weekly updates for all packages
- ✅ **GitHub Actions** - Weekly workflow action updates
- ✅ **Grouped updates** - Next.js, React, TypeScript, Tailwind CSS, ESLint
- ✅ **Conventional commits** - `chore(deps)`, `chore(ci)`
- ✅ **Auto-labeling** - `dependencies`, `automated`

**Schedule:** Every Monday at 6:00 AM UTC

### 🔧 Configuration Files

#### 9. **CODEOWNERS** - `.github/CODEOWNERS`
- ✅ Defines default code reviewers (currently @masabinhok)
- ✅ Auto-requests reviews on PR creation
- ✅ Covers: workflows, docs, algorithms, components, configs

#### 10. **Pull Request Template** - `.github/PULL_REQUEST_TEMPLATE.md`
- ✅ Standardized PR format
- ✅ Type of change checklist
- ✅ Testing section
- ✅ Screenshots for UI changes
- ✅ Workflow summary section (for CI/CD changes)
- ✅ Documentation checklist
- ✅ Hacktoberfest confirmation

### 📋 Issue Templates

#### 11-14. **Issue Templates** - `.github/ISSUE_TEMPLATE/`
- ✅ **Bug Report** - Structured bug reporting with environment details
- ✅ **Feature Request** - Feature proposals with use cases and benefits
- ✅ **Algorithm Request** - Specialized template for algorithm visualization requests
- ✅ **Config** - Links to discussions, docs, and Hacktoberfest

### 📚 Documentation

#### 15. **Workflows Documentation** - `.github/WORKFLOWS.md`
**Comprehensive 300+ line guide covering:**
- ✅ Detailed workflow explanations
- ✅ Setup instructions for repository owner
- ✅ Troubleshooting guide
- ✅ Best practices for contributors and maintainers
- ✅ Configuration details
- ✅ Common issues and solutions

#### 16. **Labels Configuration** - `.github/labels.yml`
- ✅ 30+ label definitions with colors and descriptions
- ✅ Categories: type, area, priority, status, automation, technical
- ✅ Ready to import using GitHub Label Sync

#### 17. **Setup Summary** - `.github/SETUP_SUMMARY.md`
- ✅ Quick overview of all added files
- ✅ Setup guide for repository owner
- ✅ Testing checklist
- ✅ Expected benefits summary

#### 18. **Owner Checklist** - `.github/CHECKLIST.md`
- ✅ Step-by-step setup guide
- ✅ Secret configuration instructions
- ✅ Label creation guide
- ✅ Testing procedures
- ✅ Ongoing maintenance tasks

#### 19. **Updated README** - `README.md`
**New section: "🧩 GitHub Actions Setup"**
- ✅ Overview of all workflows
- ✅ Workflow descriptions and triggers
- ✅ Setup instructions for forks
- ✅ Benefits summary
- ✅ Status badge examples

## 🎨 UI/UX Changes

No UI changes - all backend automation and documentation.

## 🧪 Testing

✅ All workflow YAML files validated for syntax  
✅ Workflow logic reviewed for correctness  
✅ Documentation thoroughly proofread  
✅ Issue templates tested for formatting  
✅ PR template tested for completeness  

**Ready to test on repository:**
1. Merge this PR
2. Create a test PR to trigger workflows
3. Verify all workflows run successfully
4. Check auto-labeling works
5. Test deployment to Vercel (after secrets configured)

## 📸 Workflow Diagram

```
Pull Request → CI + Format + CodeQL + Auto Label + Greetings
     ↓
  Approved → Auto Merge (if labeled)
     ↓
Merged to Main → CI + Deploy + CodeQL

Weekly → Dependabot + CodeQL Scan
```

## 📚 Documentation Updates

- [x] README.md - Added comprehensive "GitHub Actions Setup" section
- [x] New file: `.github/WORKFLOWS.md` - Detailed workflow documentation
- [x] New file: `.github/SETUP_SUMMARY.md` - Quick setup guide
- [x] New file: `.github/CHECKLIST.md` - Repository owner checklist
- [x] New file: `.github/labels.yml` - Label definitions

## ✅ Checklist

- [x] All workflow files use official maintained actions
- [x] Caching implemented for faster runs (actions/setup-node)
- [x] Descriptive comments in all YAML files
- [x] No redundant triggers or duplicate builds
- [x] Workflows are reusable and contributor-friendly
- [x] Documentation is comprehensive and clear
- [x] Issue and PR templates are user-friendly
- [x] CODEOWNERS configured correctly
- [x] Dependabot groups related updates
- [x] CodeQL uses security-and-quality query set
- [x] All files follow project conventions
- [x] No sensitive data exposed

## 🔗 Related Issues

Closes: N/A (proactive improvement)

## 📋 Additional Notes

### 🔐 Setup Required After Merge

1. **Configure Vercel Secrets** (for deployment):
   - `VERCEL_TOKEN` - Get from [Vercel account settings](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - From `.vercel/project.json`
   - `VERCEL_PROJECT_ID` - From `.vercel/project.json`

2. **Create GitHub Labels:**
   - Use `.github/labels.yml` as reference
   - Manual: Issues → Labels → New label
   - Automated: [GitHub Label Sync](https://github.com/Financial-Times/github-label-sync)

3. **Enable Branch Protection** (recommended):
   - Require CI, Format Check, and CodeQL to pass
   - Require pull request reviews

See `.github/CHECKLIST.md` for complete setup instructions.

### 📊 Benefits

**Code Quality:**
- ✅ Automated linting and type checking
- ✅ Build verification on every PR
- ✅ Consistent code formatting

**Security:**
- ✅ Weekly CodeQL scans
- ✅ Automated dependency updates
- ✅ Security alerts in GitHub

**Productivity:**
- ✅ Auto-deploy to Vercel
- ✅ Auto-labeling saves time
- ✅ Auto-merge for trusted PRs
- ✅ Caching speeds up CI

**Community:**
- ✅ Welcoming first-time contributors
- ✅ Clear contribution process
- ✅ Organized issue tracking
- ✅ Hacktoberfest-friendly

### 🎃 Hacktoberfest Ready

This setup makes Vizit an ideal Hacktoberfest project:
- ✅ Automated greetings for new contributors
- ✅ Good first issue labeling
- ✅ Clear contributing guidelines
- ✅ Comprehensive issue templates
- ✅ Fast CI feedback
- ✅ Friendly community workflows

### 📁 Files Added

**Total:** 19 files

**Workflows (7):**
- `.github/workflows/ci.yml`
- `.github/workflows/format.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/greetings.yml`
- `.github/workflows/label.yml`
- `.github/workflows/auto-merge.yml`
- `.github/workflows/codeql.yml`

**Configuration (5):**
- `.github/dependabot.yml`
- `.github/CODEOWNERS`
- `.github/labels.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/config.yml`

**Templates (3):**
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/algorithm_request.md`

**Documentation (4):**
- `.github/WORKFLOWS.md` (comprehensive guide)
- `.github/SETUP_SUMMARY.md` (quick overview)
- `.github/CHECKLIST.md` (owner tasks)
- Updated: `README.md` (new section)

---

## 🎉 Ready to Automate!

This PR transforms Vizit into a fully automated, contributor-friendly, secure open-source project. All workflows follow GitHub Actions best practices and are optimized for speed and reliability.

**Thank you for reviewing! 💙**

---

*For detailed information, see [.github/WORKFLOWS.md](./.github/WORKFLOWS.md)*
