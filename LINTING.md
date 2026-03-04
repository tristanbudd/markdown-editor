# ESLint and Prettier Setup

This project is configured with ESLint and Prettier following industry-standard best practices for Next.js and shadcn/ui development.

## Configuration Files

- **`.prettierrc.json`** - Prettier configuration with Tailwind CSS class sorting and import organization
- **`.prettierignore`** - Files to ignore for Prettier
- **`eslint.config.mjs`** - ESLint configuration with Next.js, TypeScript, and shadcn best practices

## Available Scripts

- **`pnpm lint`** - Check for linting errors
- **`pnpm lint:fix`** - Fix auto-fixable linting errors
- **`pnpm format`** - Format all files with Prettier
- **`pnpm format:check`** - Check if files are formatted correctly

## Key Features

### Prettier Settings

- **Semi-colons**: Disabled for TypeScript/JSX files (modern convention), enabled for `.js/.mjs/.cjs` config files
- **Single quotes**: Disabled (uses double quotes)
- **Print width**: 100 characters (optimal for modern screens)
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 compatible
- **Auto-sort Tailwind classes**: Enabled via `prettier-plugin-tailwindcss`
- **Auto-organize imports**: Enabled with custom order:
  1. React imports
  2. Next.js imports
  3. Third-party packages
  4. Type imports
  5. Config, lib, hooks
  6. UI components
  7. Other components
  8. Styles and app-specific imports
  9. Relative imports

### ESLint Rules

**React/JSX:**

- Enforces self-closing components
- Warns about unnecessary curly braces in JSX
- Sorts JSX props (reserved first, shorthand first, callbacks last)
- No React import needed (Next.js 13+ handles this)

**TypeScript:**

- Unused variables starting with `_` are allowed
- Warns on `any` type usage
- Enforces consistent type imports with inline style
- Example: `import { type User } from "./types"`

**Code Quality:**

- Warns on `console.log` (allows `console.warn` and `console.error`)
- Enforces `const` over `let` when variables aren't reassigned
- Prevents unused expressions

**shadcn Compatibility:**

- Ignores `components/ui/**` directory (generated shadcn components)
- Follows shadcn naming and formatting conventions

## VS Code Integration (Recommended)

For the best development experience, install these VS Code extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

Then add to your VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Pre-commit Hook (Recommended)

Add a pre-commit hook using husky and lint-staged to ensure code quality:

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
echo "pnpm exec lint-staged" > .husky/pre-commit
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,mdx}": ["prettier --write"]
  }
}
```

## Best Practices

1. **Run linting before committing**: Use `pnpm lint` to check for errors
2. **Format on save**: Enable in your editor for automatic formatting
3. **Review auto-fixes**: While `lint:fix` is helpful, always review changes
4. **TypeScript strict mode**: Already enabled in `tsconfig.json`
5. **Import organization**: Prettier will auto-organize imports on save

## shadcn/ui Specific

When adding shadcn components:

- Generated components in `components/ui/` are ignored by ESLint
- You can still manually format them with Prettier
- Custom modifications to shadcn components should follow project conventions
