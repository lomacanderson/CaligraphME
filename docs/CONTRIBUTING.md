# Contributing to CaligraphME

Thank you for your interest in contributing to CaligraphME!

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Set up environment variables (see `docs/SETUP.md`)
5. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Style

- Use TypeScript for all new code
- Follow the existing code structure and naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Naming Conventions

- **Files**: PascalCase for components (e.g., `StoryPage.tsx`), camelCase for utilities (e.g., `api.client.ts`)
- **Components**: PascalCase (e.g., `DrawingCanvas`)
- **Functions**: camelCase (e.g., `loadStories`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `StoryProps`)

## Project Structure

```
CaligraphME/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── stores/       # State management
│   │   └── styles/       # CSS styles
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Express middleware
├── shared/            # Shared types and utilities
│   └── src/
│       ├── types/        # TypeScript types
│       ├── schemas/      # Validation schemas
│       └── constants/    # Shared constants
└── docs/              # Documentation
```

## Making Changes

### Frontend Changes

1. Create components in appropriate directories
2. Use TypeScript interfaces for props
3. Follow React best practices (hooks, functional components)
4. Update relevant types in `shared/src/types/`
5. Add styles to component or global CSS

### Backend Changes

1. Add routes in `backend/src/routes/`
2. Create controllers in `backend/src/controllers/`
3. Implement business logic in `backend/src/services/`
4. Update types in `shared/src/types/`
5. Document API endpoints in `docs/API_ENDPOINTS.md`

### Shared Types

1. Add/modify types in `shared/src/types/`
2. Update Zod schemas in `shared/src/schemas/`
3. Add constants in `shared/src/constants/`

## Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(frontend): add drawing canvas component

Add interactive canvas for handwriting input with clear and save functionality.

Closes #123
```

```
fix(backend): correct OCR confidence threshold

Changed threshold from 0.5 to 0.7 for better accuracy.
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass (when implemented)
3. Update the README.md if needed
4. Create a pull request with a clear description
5. Link any related issues
6. Wait for review and address feedback

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve if changes look good
- Request changes if issues found
- Test the changes locally if possible

### For Contributors

- Address all feedback
- Ask questions if unclear
- Make requested changes promptly
- Be open to suggestions

## Testing

Currently, tests are not implemented. When they are:

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run all tests
npm test
```

## Documentation

- Update relevant documentation for significant changes
- Add JSDoc comments for complex functions
- Keep API documentation up to date
- Add examples where helpful

## Feature Implementation Workflow

1. **Planning**
   - Discuss feature in issues
   - Create design document if complex
   - Get approval before starting

2. **Implementation**
   - Start with types/interfaces
   - Implement backend API
   - Implement frontend UI
   - Test thoroughly

3. **Review**
   - Self-review code
   - Create pull request
   - Address feedback
   - Merge when approved

## Getting Help

- Open an issue for bugs or questions
- Tag maintainers for urgent matters
- Join discussions in pull requests
- Check documentation first

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make CaligraphME better for everyone. Thank you for taking the time to contribute! 🎉

