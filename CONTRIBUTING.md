# Contributing to CustomHooks

First off, thank you for considering contributing to CustomHooks! 🎉 It's people like you that make this project better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Adding New Hooks](#adding-new-hooks)
  - [Improving Documentation](#improving-documentation)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style Guide](#code-style-guide)
- [Project Structure](#project-structure)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful, inclusive, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, React/React Native version, etc.)
- **Code snippets** that demonstrate the issue

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** (if you have one)
- **Alternatives** you've considered

### Adding New Hooks

We love new hooks! Here's how to add one:

1. **Check if a similar hook exists** - Browse the existing hooks to avoid duplication
2. **Create a new folder** with a descriptive name (e.g., `YourHookName/`)
3. **Follow the naming convention**:
   - Hook file: `useYourHookName.ts` or `useYourHookName.tsx`
   - Example file: `example.tsx` or `usageExample.tsx` (optional but recommended)
4. **Write the hook** following our [Code Style Guide](#code-style-guide)
5. **Add documentation** - Include comments and usage examples
6. **Update the README.md** - Add your hook to the appropriate section

### Improving Documentation

Documentation improvements are always welcome! This includes:

- Fixing typos
- Clarifying unclear explanations
- Adding more examples
- Improving code comments
- Updating the README

## Development Guidelines

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript knowledge
- React/React Native experience

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CustomHooks.git
   cd CustomHooks
   ```

2. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-hook-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes** following the guidelines below

4. **Test your changes** to ensure they work as expected

5. **Commit your changes** with a clear message
   ```bash
   git commit -m "Add: New hook for [description]"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-hook-name
   ```

7. **Open a Pull Request** on GitHub

## Code Style Guide

### TypeScript Requirements

- ✅ **Always use TypeScript** for type safety and consistency
- ✅ **Define proper types** for all parameters and return values
- ✅ **Use interfaces** for complex types
- ✅ **Avoid `any` type** - use `unknown` or proper types instead

### Hook Structure

```typescript
import { useState, useEffect } from 'react';

/**
 * Brief description of what the hook does
 * 
 * @param param1 - Description of parameter 1
 * @param param2 - Description of parameter 2 (optional)
 * @returns Description of return value
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useYourHook(param1, param2);
 * ```
 */
export const useYourHook = (param1: string, param2?: number) => {
  // Hook implementation
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return {
    // Return values
  };
};
```

### Code Quality Standards

- ✅ **Keep code clean, modular, and reusable**
- ✅ **Follow React Hooks rules** (only call hooks at the top level)
- ✅ **Handle edge cases** and error scenarios
- ✅ **Add comments** for complex logic
- ✅ **Use meaningful variable names**
- ✅ **Keep functions small and focused**

### File Naming

- Hook files: `useYourHookName.ts` or `useYourHookName.tsx`
- Example files: `example.tsx` or `usageExample.tsx`
- Folder names: `YourHookName/` (PascalCase)

### Example File Template

If you're adding a usage example, use this template:

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useYourHook } from './useYourHook';

export const Example = () => {
  const { data, loading, error, refetch } = useYourHook();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
      <Button title="Refetch" onPress={refetch} />
    </View>
  );
};
```

## Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Ensure your code follows the style guidelines**
3. **Add or update tests** if applicable
4. **Update documentation** as needed
5. **Ensure the PR description** clearly describes:
   - What changes were made
   - Why they were made
   - How to test them

### PR Title Format

Use one of these prefixes:
- `Add:` for new hooks
- `Fix:` for bug fixes
- `Update:` for updates to existing hooks
- `Docs:` for documentation changes
- `Refactor:` for code refactoring

Examples:
- `Add: useCustomHook for handling X`
- `Fix: useApiCall error handling`
- `Update: useBiometricAuth to support new methods`
- `Docs: Improve README formatting`

### Review Process

- All PRs require at least one approval
- Maintainers will review code quality, style, and functionality
- Be open to feedback and suggestions
- Address review comments promptly

## Project Structure

```
CustomHooks/
├── YourHookName/
│   ├── useYourHookName.ts      # Main hook file
│   └── example.tsx              # Usage example (optional)
├── README.md                    # Main documentation
├── CONTRIBUTING.md             # This file
└── index.html                  # Marketing page
```

### Where to Place Your Hook

- Create a new folder with a descriptive name
- Place the hook file inside that folder
- Optionally add an example file
- Update the README.md to include your hook

## Testing Guidelines

While we don't have a formal testing framework set up, please:

- ✅ **Test your hook** in a real React/React Native environment
- ✅ **Test edge cases** (empty states, errors, etc.)
- ✅ **Include usage examples** in your PR
- ✅ **Verify TypeScript types** compile correctly

## Questions?

If you have questions about contributing:

1. Check existing issues and PRs
2. Open a new issue with the `question` label
3. Reach out to maintainers

## Recognition

Contributors will be recognized in:
- README.md (if you'd like to be added)
- Release notes
- Project documentation

---

Thank you for contributing to CustomHooks! Your efforts help make React and React Native development easier for everyone. 🚀

**Happy Coding! 💻**

