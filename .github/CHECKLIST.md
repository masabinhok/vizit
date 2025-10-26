# 🚀 Repository Owner Checklist

Use this checklist to complete the GitHub Actions setup for Vizit.

---

## ✅ Initial Setup (Do Once)

### 1. Review Added Files
- [ ] Review all workflow files in `.github/workflows/`
- [ ] Check `.github/dependabot.yml` configuration
- [ ] Verify `.github/CODEOWNERS` has correct username
- [ ] Review issue templates in `.github/ISSUE_TEMPLATE/`
- [ ] Check pull request template
- [ ] Read through documentation files

### 2. Configure GitHub Repository Settings

#### Enable GitHub Actions
- [ ] Go to: Settings → Actions → General
- [ ] Select: "Allow all actions and reusable workflows"
- [ ] Save changes

#### Branch Protection Rules (Recommended)
- [ ] Go to: Settings → Branches
- [ ] Add rule for `main` branch:
  - [ ] Require pull request reviews before merging
  - [ ] Require status checks to pass (select: CI, Format Check, CodeQL)
  - [ ] Require branches to be up to date before merging
  - [ ] Include administrators (optional)

#### Enable Dependabot
- [ ] Go to: Settings → Security → Dependabot
- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Dependabot version updates (auto-enabled with config file)

#### Enable CodeQL
- [ ] Go to: Security → Code scanning → Setup
- [ ] Should show "CodeQL analysis is already configured"
- [ ] If not, workflow will auto-enable on first run

### 3. Configure Secrets for Deployment

#### Get Vercel Credentials
1. [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Get Vercel Token:
   - [ ] Go to [Account Settings → Tokens](https://vercel.com/account/tokens)
   - [ ] Click "Create Token"
   - [ ] Name: "GitHub Actions"
   - [ ] Expiration: No expiration (or set preference)
   - [ ] Copy the token (save it securely)

3. [ ] Get Project IDs:
   - [ ] Check `.vercel/project.json` in your repo
   - [ ] Or run `vercel link` locally and check the file
   - [ ] Note `orgId` and `projectId`

#### Add Secrets to GitHub
- [ ] Go to: Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Add these secrets:
  - [ ] `VERCEL_TOKEN` - Your Vercel token from above
  - [ ] `VERCEL_ORG_ID` - The `orgId` from project.json
  - [ ] `VERCEL_PROJECT_ID` - The `projectId` from project.json

### 4. Create GitHub Labels

#### Option A: Manual Creation
- [ ] Go to: Issues → Labels
- [ ] Click "New label" for each label in `.github/labels.yml`
- [ ] Copy name, color, and description

#### Option B: Automated (Recommended)
Use [GitHub Label Sync](https://github.com/Financial-Times/github-label-sync):

```bash
# Install globally
npm install -g github-label-sync

# Sync labels (you'll need a GitHub token)
github-label-sync --access-token YOUR_TOKEN masabinhok/vizit --labels .github/labels.yml
```

Or use the web UI: https://github-label-sync.com/

**Priority Labels to Create:**
- [ ] `bug` (red: #d73a4a)
- [ ] `enhancement` (blue: #a2eeef)
- [ ] `documentation` (light blue: #0075ca)
- [ ] `algorithm` (blue: #1d76db)
- [ ] `good first issue` (purple: #7057ff)
- [ ] `help wanted` (green: #008672)
- [ ] `hacktoberfest` (orange: #ff8c00)
- [ ] `automerge` (gray: #ededed)
- [ ] `do-not-merge` (red: #ee0701)
- [ ] `work-in-progress` (yellow: #fbca04)
- [ ] `dependencies` (blue: #0366d6)
- [ ] `automated` (green: #34d058)

### 5. Update Documentation

#### README Badges (Optional)
- [ ] Add workflow status badges to README.md:
```markdown
![CI](https://github.com/masabinhok/vizit/workflows/CI/badge.svg)
![CodeQL](https://github.com/masabinhok/vizit/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Deploy](https://github.com/masabinhok/vizit/workflows/Deploy/badge.svg)
```

#### CONTRIBUTING.md
- [ ] Already updated - review and customize if needed

---

## 🧪 Testing (Do After Setup)

### Test Workflows

#### 1. Test CI Workflow
- [ ] Create a test branch: `git checkout -b test/github-actions`
- [ ] Make a small change (e.g., add comment to README)
- [ ] Commit and push: `git push origin test/github-actions`
- [ ] Create a pull request
- [ ] Verify CI runs:
  - [ ] Lint job passes
  - [ ] Type check job passes
  - [ ] Build job passes
- [ ] Check Actions tab to see workflow run

#### 2. Test Format Check
- [ ] In the same test PR
- [ ] Verify format check runs
- [ ] Should pass if no linting errors

#### 3. Test Auto Label
- [ ] Check if PR got auto-labeled
- [ ] Should have labels based on changes

#### 4. Test Greetings (If First PR)
- [ ] Might see greeting message if you haven't contributed before
- [ ] Test with a collaborator's first PR

#### 5. Test CodeQL
- [ ] Should run automatically on PR
- [ ] Check Security tab → Code scanning
- [ ] May take 5-10 minutes first run

#### 6. Test Deployment
- [ ] Merge the test PR to `main`
- [ ] Verify deploy workflow runs
- [ ] Check if site deploys to Vercel
- [ ] Visit deployed URL

### Monitor Workflow Runs
- [ ] Go to: Actions tab
- [ ] Check all workflows completed successfully
- [ ] Review any errors and fix if needed

---

## 📅 Ongoing Maintenance

### Weekly Tasks
- [ ] Review Dependabot PRs
  - Check dependency updates
  - Review changelogs
  - Test if needed
  - Merge when safe
  
- [ ] Check CodeQL security alerts
  - Review any new alerts
  - Fix vulnerabilities
  - Dismiss false positives with explanation

### Monthly Tasks
- [ ] Review workflow performance
  - Check workflow run times
  - Optimize if needed
  - Update caching strategies

- [ ] Update documentation
  - Keep WORKFLOWS.md current
  - Update README if workflows change

### As Needed
- [ ] Label issues appropriately
- [ ] Add `automerge` label to trusted PRs
- [ ] Review and approve community PRs
- [ ] Respond to first-time contributors
- [ ] Monitor Actions usage (minutes)

---

## 🎯 Quick Reference

### Important URLs

**GitHub Settings:**
- Actions: `https://github.com/masabinhok/vizit/settings/actions`
- Secrets: `https://github.com/masabinhok/vizit/settings/secrets/actions`
- Branches: `https://github.com/masabinhok/vizit/settings/branches`
- Labels: `https://github.com/masabinhok/vizit/labels`

**Monitoring:**
- Workflows: `https://github.com/masabinhok/vizit/actions`
- Security: `https://github.com/masabinhok/vizit/security`
- Code Scanning: `https://github.com/masabinhok/vizit/security/code-scanning`
- Dependabot: `https://github.com/masabinhok/vizit/security/dependabot`

**Vercel:**
- Dashboard: `https://vercel.com/dashboard`
- Tokens: `https://vercel.com/account/tokens`

### Common Commands

```bash
# View workflow files
ls .github/workflows/

# Test locally (requires 'act' tool)
act pull_request

# Check workflow syntax
# Use GitHub Actions extension in VS Code
# Or: https://rhysd.github.io/actionlint/

# View workflow runs
gh run list

# View specific run
gh run view [run-id]
```

---

## ❓ Troubleshooting

### Workflow Fails

**"npm ci" fails:**
- [ ] Delete `package-lock.json`
- [ ] Run `npm install` locally
- [ ] Commit new lock file

**Build fails:**
- [ ] Check build locally: `npm run build`
- [ ] Fix any errors
- [ ] Push fixes

**Deployment fails:**
- [ ] Verify Vercel secrets are correct
- [ ] Check Vercel project exists
- [ ] Review Vercel logs

### Dependabot Issues

**Too many PRs:**
- [ ] Adjust `open-pull-requests-limit` in dependabot.yml
- [ ] Close unnecessary PRs

**Breaking changes:**
- [ ] Review breaking changes
- [ ] Update code as needed
- [ ] Test thoroughly

### CodeQL Issues

**Timeout:**
- [ ] Normal for first run
- [ ] Subsequent runs faster
- [ ] Increase timeout if needed

**False positives:**
- [ ] Review alert carefully
- [ ] Dismiss with explanation
- [ ] Document in code if needed

---

## 📚 Resources

- [Setup Summary](./.github/SETUP_SUMMARY.md) - Overview of what was added
- [Workflows Documentation](./.github/WORKFLOWS.md) - Detailed workflow docs
- [Labels Configuration](./.github/labels.yml) - All labels to create
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [CodeQL Docs](https://codeql.github.com/docs/)
- [Dependabot Docs](https://docs.github.com/en/code-security/dependabot)

---

## ✅ Completion Checklist

- [ ] All workflows reviewed and understood
- [ ] GitHub Actions enabled
- [ ] Secrets configured (Vercel)
- [ ] Labels created
- [ ] Branch protection enabled (recommended)
- [ ] Test PR created and verified
- [ ] All workflows passing
- [ ] Deployment working
- [ ] Documentation reviewed
- [ ] Team informed of changes

---

## 🎉 You're All Set!

Once you've completed this checklist, your repository will have:
✅ Automated CI/CD pipeline  
✅ Security scanning  
✅ Dependency updates  
✅ Community engagement  
✅ Quality enforcement  

**Next Steps:**
1. Commit all the new files
2. Push to GitHub
3. Create a test PR
4. Monitor the workflows
5. Share with contributors!

---

**Questions?** See [WORKFLOWS.md](./.github/WORKFLOWS.md) or create an issue!

**Happy automating! 🚀**
