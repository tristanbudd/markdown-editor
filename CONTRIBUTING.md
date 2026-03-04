# Contributing to Markdown Editor

Thanks for your interest in contributing! We welcome bug reports, feature requests, and pull requests.

## How to Contribute

1. Fork the repository and create a feature branch:

```bash
git checkout -b feat/your-feature
```

2. Install dependencies and run the dev server:

```bash
pnpm install
pnpm dev
```

3. Make your changes. Keep them small and focused.

4. Run the checks locally before opening a PR:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
```

5. Commit and open a pull request (target `main`). Describe the change and include screenshots if UI-related.

## Guidelines

- Follow existing code style and patterns (Tailwind + shadcn-friendly components).
- Write tests for new behavior when feasible.
- Keep accessibility in mind (keyboard support, semantic HTML, ARIA where appropriate).

## Code review

Pull requests will be reviewed by project maintainers. You may be asked to iterate on changes before merging.

## Code of Conduct

This project follows the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Please be respectful and constructive.
