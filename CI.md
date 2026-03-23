# CI/CD Setup

This project uses Husky for pre-commit checks and GitHub Actions for continuous integration.

## Pre-commit Hooks (Husky)

Husky is configured to automatically run checks before each commit to ensure code quality.

### What runs on pre-commit:

- **ESLint** - Auto-fixes linting issues on staged files
- **Prettier** - Auto-formats staged files
- **Type checking** - Runs automatically during build

### How it works:

1. You stage files with `git add`
2. You commit with `git commit`
3. Husky triggers `lint-staged`
4. Only staged files are checked and auto-fixed
5. If checks pass, commit proceeds
6. If checks fail, commit is blocked

### Configuration:

- **`.husky/pre-commit`** - Pre-commit hook script
- **`package.json` → `lint-staged`** - Defines what to run on staged files

### Bypassing pre-commit (not recommended):

```bash
git commit --no-verify
```

## GitHub Actions CI

Continuous Integration runs on every push to `main` and on all pull requests.

### CI Pipeline (.github/workflows/ci.yml):

1. **Checkout code** - Gets the repository code
2. **Setup pnpm** - Installs pnpm package manager
3. **Setup Node.js** - Installs Node.js 20 with pnpm cache
4. **Install dependencies** - Runs `pnpm install --frozen-lockfile`
5. **Run ESLint** - Checks for linting errors
6. **Check formatting** - Verifies Prettier formatting
7. **Type check** - Runs TypeScript compiler
8. **Build** - Creates production build of Next.js app

### CI Checks:

✓ **ESLint** - Code quality and style  
✓ **Prettier** - Code formatting consistency  
✓ **TypeScript** - Type safety  
✓ **Next.js Build** - Production build verification

### Viewing CI Results:

- Go to the "Actions" tab in your GitHub repository
- Click on any workflow run to see details
- Failed checks will block PR merges (if branch protection is enabled)

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check for linting errors
pnpm lint:fix         # Auto-fix linting errors
pnpm format           # Format all files with Prettier
pnpm format:check     # Check if files are formatted
pnpm typecheck        # Run TypeScript type checking

# Git hooks (automatically run)
pnpm prepare          # Set up Husky hooks
```

## Setup for New Contributors

When cloning the repository:

```bash
# Install dependencies (this also sets up Husky)
pnpm install

# Verify everything works
pnpm lint
pnpm typecheck
pnpm build
```

The `prepare` script automatically sets up Husky hooks when you run `pnpm install`.

## Troubleshooting

### Pre-commit hook not running:

```bash
# Reinstall Husky hooks
pnpm exec husky install
```

### Lint-staged failing:

```bash
# Run manually to see errors
pnpm exec lint-staged
```

### CI failing but local checks pass:

- Ensure you're using Node.js 20
- Run `pnpm install --frozen-lockfile`
- Check that all changes are committed
