# Contributing to Expense Tracker

Thank you for considering contributing to Expense Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Follow the coding standards below
5. Test your changes thoroughly
6. Commit with clear messages (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use PropTypes or TypeScript for type checking

### CSS/Tailwind

- Use Tailwind utility classes
- Follow dark mode patterns: `dark:bg-gray-800`
- Keep custom CSS minimal
- Use responsive design patterns

### File Organization

```
src/
├── components/
│   ├── common/       # Reusable UI components
│   ├── layout/       # Layout components
│   ├── modals/       # Modal dialogs
│   └── inputs/       # Form inputs
├── pages/            # Page components
├── context/          # React context
├── hooks/            # Custom hooks
└── utils/            # Utility functions
```

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:

- `feat: Add dark mode toggle`
- `fix: Resolve login authentication issue`
- `docs: Update installation instructions`
- `style: Format code with prettier`
- `refactor: Simplify expense calculation logic`

## Development Workflow

1. Install dependencies
2. Create `.env` files (see README.md)
3. Start backend server
4. Start frontend dev server
5. Make changes
6. Test locally
7. Submit PR

## Testing

- Test all features manually
- Check responsive design on different screen sizes
- Verify dark mode works correctly
- Test authentication flows
- Ensure API endpoints work as expected

## Questions?

Feel free to open an issue for any questions or clarifications.
