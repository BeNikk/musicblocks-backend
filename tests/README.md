# Testing Guide for Musicblocks Backend

This directory contains comprehensive unit tests for the Musicblocks Backend project using Jest as the testing framework.

## Testing Strategy

The project heavily relies on external services (GitHub API, Git operations), so we use extensive mocking to isolate the code under test and ensure reliable, fast test execution.

### What We Test

1. **Controllers**: Business logic and request/response handling
2. **Services**: Core business operations with mocked external dependencies
3. **Utilities**: Pure functions and helper methods
4. **Routes**: HTTP routing and middleware integration
5. **Error Handling**: Graceful failure scenarios
6. **Edge Cases**: Boundary conditions and unusual inputs

### What We Mock

- **GitHub API calls** (via Octokit)
- **File system operations**
- **Git operations**
- **External HTTP requests**
- **Time-dependent operations** (dates, timestamps)

## Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Running Specific Test Files

```bash
# Run only controller tests
npm test -- tests/controllers/

# Run only utility tests
npm test -- tests/utils/

# Run only service tests
npm test -- tests/services/

# Run only route tests
npm test -- tests/routes/
```

### Running Specific Test Suites

```bash
# Run tests matching a pattern
npm test -- --testNamePattern="createProject"

# Run tests in a specific file
npm test -- tests/controllers/createProject.test.ts
```

## Test Structure

```
tests/
├── setup.ts                 # Global test configuration
├── README.md               # This file
├── controllers/            # Controller tests
│   └── createProject.test.ts
├── services/               # Service tests
│   └── createRepo.test.ts
├── utils/                  # Utility function tests
│   ├── hash.test.ts
│   ├── getRepoName.test.ts
│   └── sanitizeTopics.test.ts
└── routes/                 # Route tests
    └── projectRoutes.test.ts
```

## Test Patterns

### Controller Testing

Controllers are tested by:
- Mocking all service dependencies
- Testing request/response handling
- Verifying error scenarios
- Testing input validation
- Checking response formats

Example:
```typescript
// Mock the service
jest.mock('../../src/services/createRepo');

// Test the controller logic
it('should return 400 when projectData is missing', async () => {
  // Test implementation
});
```

### Service Testing

Services are tested by:
- Mocking external API calls
- Testing business logic
- Verifying error handling
- Testing edge cases
- Checking data transformations

Example:
```typescript
// Mock external dependencies
jest.mock('../../src/utils/octokit');
jest.mock('../../src/config/gitConfig');

// Test the service logic
it('should create repository with valid input', async () => {
  // Test implementation
});
```

### Utility Testing

Utility functions are tested by:
- Testing with various input types
- Verifying edge cases
- Testing error conditions
- Checking output formats

Example:
```typescript
// Test pure functions
it('should handle empty string input', () => {
  const result = utilityFunction('');
  expect(result).toBe(expectedValue);
});
```

## Mocking Strategy

### External Services

We mock external services to:
- Avoid network calls during testing
- Control test scenarios
- Ensure consistent test results
- Speed up test execution

### Time-Dependent Operations

We mock time operations to:
- Ensure predictable test results
- Test specific time scenarios
- Avoid flaky tests due to timing

### File System Operations

We mock file system operations to:
- Avoid actual file creation/deletion
- Test error scenarios
- Ensure test isolation

## Coverage Goals

We aim for:
- **90%+ line coverage** for all source files
- **100% coverage** for critical business logic
- **Comprehensive edge case testing**
- **Error scenario coverage**

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the scenario
3. **Test one thing per test case**
4. **Arrange, Act, Assert** pattern for test structure

### Mocking

1. **Mock at the right level** (service boundaries, not internal functions)
2. **Reset mocks** between tests using `beforeEach`
3. **Verify mock calls** to ensure correct interaction
4. **Use realistic mock data** that matches production scenarios

### Assertions

1. **Test the behavior, not the implementation**
2. **Use specific assertions** rather than generic ones
3. **Test both success and failure paths**
4. **Verify error messages and status codes**

## Debugging Tests

### Running Tests in Debug Mode

```bash
# Run tests with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test with debugging
npm test -- --runInBand --testNamePattern="specific test name"
```

### Common Issues

1. **Mock not working**: Check import paths and mock setup
2. **Async test failures**: Ensure proper async/await usage
3. **Mock reset issues**: Use `beforeEach` to clear mocks
4. **Import errors**: Check TypeScript paths and module resolution

## Continuous Integration

Tests are automatically run:
- On every pull request
- Before merging to main branch
- On scheduled intervals

### CI Requirements

- All tests must pass
- Coverage must meet minimum thresholds
- No linting errors
- TypeScript compilation must succeed

## Adding New Tests

When adding new functionality:

1. **Write tests first** (TDD approach)
2. **Test all code paths** including error scenarios
3. **Mock external dependencies** appropriately
4. **Update this README** if adding new test patterns
5. **Ensure coverage targets** are maintained

## Performance Considerations

- **Tests should run quickly** (< 30 seconds for full suite)
- **Use efficient mocking** to avoid slow operations
- **Avoid unnecessary setup/teardown** operations
- **Run tests in parallel** when possible

## Troubleshooting

### Test Environment Issues

```bash
# Clear Jest cache
npm test -- --clearCache

# Reset node_modules
rm -rf node_modules package-lock.json
npm install
```

### Mock Issues

```bash
# Check mock setup
npm test -- --verbose

# Run single test file
npm test -- tests/specific/test.test.ts
```

For more help, check the Jest documentation or create an issue in the project repository.
