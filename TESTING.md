# Testing Guide for Style Finder

## Overview

This project includes comprehensive test suites for both backend (Django/DRF) and frontend (React) components. Tests use industry-standard frameworks and best practices with proper mocking for external API calls.

## Backend Testing (Django + pytest)

### Setup

```bash
cd backend
pip install -r requirements.txt
```

### Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_views.py

# Run specific test class
pytest tests/test_views.py::TestUploadImageViewSet

# Run specific test with verbose output
pytest tests/test_views.py::TestUploadImageViewSet::test_upload_image_success -v

# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Run tests in watch mode (requires pytest-watch)
ptw
```

### Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py                 # Pytest fixtures and configuration
├── test_models.py              # OutfitSearch model tests
├── test_serializers.py         # ImageSerializer tests
├── test_helpers.py             # Image processing helper tests
├── test_views.py               # API endpoint tests with mocked external APIs
└── pytest.ini                  # Pytest configuration
```

### Backend Test Coverage

| Module | Tests | Key Scenarios |
|--------|-------|---------------|
| **Models** | 4 | Creation, image upload, optional fields, string representation |
| **Serializers** | 4 | Valid image, missing image, instance creation, field representation |
| **Helpers** | 2 | Image resize functionality, aspect ratio preservation |
| **API Views** | 7 | Success flow, missing file, invalid file, API failures, error handling |
| **Integration** | 1 | Full pipeline with mocked Gemini and SerpAPI |

### Mocking External APIs

The tests mock:
- **Google Gemini API**: `google.generativeai` mocked to return JSON-formatted outfit analysis
- **SerpAPI**: `requests.get` mocked to return shopping results
- **File Uploads**: PIL Image used to generate test images

Example mock in conftest.py:
```python
@pytest.fixture
def gemini_mock_response():
    return {
        'refined_label': "Men's navy blazer",
        'type': 'blazer',
        'gender': 'men',
        'color': 'navy',
        'fit': 'slim',
    }
```

### Backend Test Markers

```bash
# Run only unit tests
pytest -m unit

# Run only integration tests  
pytest -m integration
```

## Frontend Testing (React + Vitest)

### Setup

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- CheapestSidebar.test.jsx

# Run tests matching a pattern
npm test -- --grep "should render"
```

### Test Structure

```
frontend/src/__tests__/
├── setup.js                    # Vitest configuration and global setup
├── CheapestSidebar.test.jsx   # topCheapest utility function tests
├── imageUploader.test.jsx      # Upload component tests
├── productCard.test.jsx        # Product card component tests
├── resultsGrid.test.jsx        # Results grid component tests
└── integration.test.jsx        # End-to-end flow tests
```

### Frontend Test Coverage

| Component | Tests | Key Scenarios |
|-----------|-------|---------------|
| **topCheapest()** | 7 | Sorting, filtering nulls, top N items, empty input, mutation check |
| **ImageUploader** | 6 | Form render, file select, error handling, loading state, results display |
| **ProductCard** | 6 | Title/price render, image, link, missing price, text truncation, styling |
| **ResultsGrid** | 6 | Label render, product list, grid layout, empty state, single product |
| **Integration** | 3 | Full upload→analyze→display flow, error handling, state reset |

### Frontend Test Configuration

`vitest.config.js` includes:
- **Environment**: jsdom (browser simulation)
- **Globals**: `describe`, `it`, `expect` available without imports
- **Coverage**: V8 provider with HTML reports
- **Setup file**: Global test utilities and mocks

### Mocking in Frontend Tests

Tests mock:
- **API calls**: `uploadImage()` function mocked with `vi.mock()`
- **Browser APIs**: File upload mocking with `userEvent`
- **Components**: Child components mocked when testing specific components

Example mock in tests:
```javascript
vi.mock('../../api', () => ({
  uploadImage: vi.fn()
}))
```

## Running All Tests (Local Development)

```bash
# Backend tests
cd backend && pytest && cd ..

# Frontend tests
cd frontend && npm test -- --run && cd ..
```

## CI/CD Integration

**GitHub Actions** (to be configured):
- Run backend pytest on every push
- Run frontend vitest on every push
- Generate coverage reports
- Fail pipeline if coverage drops below threshold

Suggested workflow:
```yaml
- name: Run Backend Tests
  run: cd backend && pytest --cov

- name: Run Frontend Tests
  run: cd frontend && npm test -- --run --coverage
```

## Test Best Practices Used

✅ **Backend**
- Pytest fixtures for reusable test data
- Mock external APIs (Gemini, SerpAPI) to avoid rate limits
- Database isolation with `@pytest.mark.django_db`
- Test marking with `@pytest.mark.unit/@pytest.mark.integration`
- Coverage tracking

✅ **Frontend**
- Mock API layer to avoid network calls
- User event simulation with `@testing-library/user-event`
- Component isolation with child mocks
- Async test handling with `waitFor`
- No real HTTP calls during tests

## Adding New Tests

### Backend

1. Create new test file in `backend/tests/test_*.py`
2. Use fixtures from `conftest.py`
3. Add `@pytest.mark.unit` or `@pytest.mark.integration`
4. Mock external API calls with `@patch` decorator
5. Use `@pytest.mark.django_db` for database tests

Example:
```python
@pytest.mark.unit
def test_new_feature(sample_image):
    result = process_image(sample_image)
    assert result is not None
```

### Frontend

1. Create new test file in `frontend/src/__tests__/ComponentName.test.jsx`
2. Import testing utilities: `describe`, `it`, `expect`, `render`, `screen`
3. Mock dependencies with `vi.mock()`
4. Test user interactions with `userEvent`
5. Use `waitFor` for async operations

Example:
```javascript
describe('NewComponent', () => {
  it('should render title', () => {
    render(<NewComponent />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})
```

## Troubleshooting

### Backend Tests Fail

**Issue**: `ModuleNotFoundError`
- Solution: Ensure all dependencies installed: `pip install -r requirements.txt`

**Issue**: Database connection error
- Solution: Tests use SQLite by default via `core.dev_settings`

**Issue**: Mocks not working
- Solution: Ensure `@pytest.mark.django_db` is present for database access

### Frontend Tests Fail

**Issue**: `Cannot find module`
- Solution: Check import paths, run `npm install`

**Issue**: `window is not defined`
- Solution: Projects already use jsdom environment in `vitest.config.js`

**Issue**: Component not rendering
- Solution: Ensure all mock modules are properly configured in test file

## Performance

- Backend tests: ~15-30 seconds for full suite
- Frontend tests: ~10-20 seconds for full suite
- Parallel test execution can speed up runs

## Coverage Targets

| Area | Current | Target |
|------|---------|--------|
| Backend | 60-70% | 80%+ |
| Frontend | 70-80% | 85%+ |
| Overall | 65-75% | 82%+ |

Run coverage reports:
```bash
# Backend
pytest --cov=app --cov-report=html
# Open: backend/htmlcov/index.html

# Frontend  
npm run test:coverage
# Open: frontend/coverage/index.html
```

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Django Testing](https://docs.djangoproject.com/en/stable/topics/testing/)
