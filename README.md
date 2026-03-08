<div align="center">
  <img width="820" height="312" alt="Markdown Editor" src="https://github.com/user-attachments/assets/72c5a276-f580-4bf5-a449-cf4178d6c089" />
</div>

# Markdown Editor

![](https://img.shields.io/github/stars/tristanbudd/markdown-editor.svg)
![](https://img.shields.io/github/watchers/tristanbudd/markdown-editor.svg)
![](https://img.shields.io/github/license/tristanbudd/markdown-editor.svg)

![](https://img.shields.io/github/issues-raw/tristanbudd/markdown-editor.svg)
![](https://img.shields.io/github/issues-closed-raw/tristanbudd/markdown-editor.svg)
![](https://img.shields.io/github/issues-pr-raw/tristanbudd/markdown-editor.svg)
![](https://img.shields.io/github/issues-pr-closed-raw/tristanbudd/markdown-editor.svg)

Markdown Editor - A fast, modern Next.js-based editor for working with Markdown (.md) files with a live preview, Git hosting integrations, and export options.

## Project Description

This project provides a lightweight, accessible Markdown editor focused on writing and previewing Markdown files with first-class support for:

- Live preview (synchronized editing)
- Platform specific formatting (GitHub, GitLab, Bitbucket & More)
- Export to HTML, PDF, and plain text
- Tailwind-based UI and shadcn-friendly components

This repository is a Next.js + TypeScript application with Prettier, ESLint, and Husky hooks configured.

## Features

- Live preview pane with Markdown rendering
- Support for platform specific formatting (GitHub, GitLab, Bitbucket & More)
- Export to HTML / PDF / Text
- Keyboard shortcuts and undo/redo history
- Dark & light themes
- Small, modular UI components compatible with `shadcn/ui`

## Preview

Light Mode Preview:
<img width="1920" height="945" alt="Markdown Editor Preview (Light Mode)" src="https://github.com/user-attachments/assets/5d9d8d57-4612-4479-b965-e21de695c6a7" />

Dark Mode Preview:
<img width="1918" height="941" alt="Markdown Editor Preview (Dark Mode)" src="https://github.com/user-attachments/assets/82542c46-75d9-4dd8-96b7-30bb3bebe1c2" />

## Documentation

- Local docs: `LINTING.md`, `CI.md`
- CI: See `.github/workflows/ci.yml`

## Installation & Project Setup

1. Clone the repository

```bash
git clone https://github.com/tristanbudd/markdown-editor.git
cd markdown-editor
```

2. Install dependencies (uses pnpm)

```bash
pnpm install
```

3. Run development server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Scripts

Common scripts included in `package.json`:

```bash
pnpm dev          # Start Next.js in development mode
pnpm build        # Build for production
pnpm start        # Start the production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix lint issues
pnpm format       # Run Prettier to format files
pnpm format:check # Check formatting
pnpm typecheck    # Run TypeScript type checking
```

## Development Notes

- This project uses Next.js 16, React 19, TypeScript 5 and Tailwind CSS.
- Prettier is configured with Tailwind and import sorting plugins.
- Husky + lint-staged runs ESLint and Prettier on staged files.

## Contributing

If you'd like to contribute, please read `CONTRIBUTING.md` and follow these general guidelines:

1. Fork the repository and create a branch for your feature/fix.
2. Run `pnpm install` and make changes.
3. Keep commits small and focused; add tests where appropriate.
4. Ensure formatting/linting passes locally: `pnpm lint && pnpm format:check && pnpm typecheck`.
5. Open a pull request describing the change and linking related issues.

## Issue & PR Templates

This repo contains templates under `.github/ISSUE_TEMPLATE` and `.github/PULL_REQUEST_TEMPLATE.md` to help standardize contributions.

## Security

If you discover a security vulnerability, please open a private issue and mark it sensitive, or follow `SECURITY.md`.

## License

This project is licensed under the MIT License, see the `LICENSE` file for details.
