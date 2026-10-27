# HomeRentals — QA Automation Portfolio

An Angular 20 home-rentals application demonstrating automated UI, API, accessibility, security, and regression testing.

Originally built with Angular 9, the application has been modernized to Angular 20 while preserving automated test coverage.

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | Angular 20, TypeScript |
| End-to-end testing | Playwright |
| Unit testing | Jasmine, Karma |
| Accessibility | axe-core with Playwright |
| Continuous integration | GitHub Actions |
| Runtime | Node.js 20.19+, 22.12+, or 24+ |

## QA Automation Coverage

- Desktop and mobile browser testing
- User interface functionality
- API behavior
- Security-focused regression checks
- Accessibility checks using axe-core
- Angular component and service unit tests

## Verified Results

The following results were verified locally during the Angular 20 migration.

| Quality Check | Result |
| --- | --- |
| Angular unit tests | 36 passed |
| Playwright tests | 22 passed |
| Total automated tests | **58 passed** |
| Statement coverage | 91.59% (line-based proxy) |
| Branch coverage | 82.09% |
| Function coverage | 80.95% |
| Line coverage | 91.59% |
| Production dependency audit | 0 vulnerabilities |
| Angular production build | Passed |

Coverage percentages were calculated from the LCOV report. LCOV does not independently report statement coverage, so the statement percentage is a line-coverage proxy.

These results are locally verified, not live CI status indicators.

## Getting Started

### Prerequisites

- A Node.js version supported by Angular 20
- npm
- A browser compatible with the selected test runner

### Install Dependencies

From the repository root:

```bash
npm ci
cd qa
npm ci
cd ..
```

Install Playwright browsers if needed:

```bash
cd qa
npx playwright install chromium
cd ..
```

### Start the Application

```bash
npm start
```

The project's Node.js server starts at:

http://localhost:8080

Keep the application server running while executing Playwright tests.

### Run Playwright Tests

From a second terminal:

```bash
cd qa
BASE_URL=http://localhost:8080 npm test
```

Playwright defaults to port 8080 if `BASE_URL` is not specified.

### Run Angular Unit Tests

For Linux systems with Chromium installed at `/usr/bin/chromium`:

```bash
CHROME_BIN=/usr/bin/chromium \
CHROME_FLAGS="--no-sandbox --disable-dev-shm-usage" \
CI=true \
./node_modules/.bin/ng test --watch=false --code-coverage --browsers=ChromeHeadless
```

Adjust the Chromium path and flags for your environment.

### Production Build

```bash
npm run build -- --configuration production
```

Angular build output: `dist/home-rentals`.

### Production Dependency Audit

```bash
npm audit --omit=dev --audit-level=moderate
```

## Continuous Integration

GitHub Actions configuration is available in `.github/workflows/playwright.yml`.

## Application Modernization

The application was migrated from Angular 9 to Angular 20, including dependency upgrades, TypeScript compatibility changes, and unit-test modernization.

Legacy Protractor and TSLint configurations remain in the repository. Playwright is the primary end-to-end testing framework for this portfolio.

## Portfolio Skills Demonstrated

- Automated test design and maintenance
- UI, API, accessibility, and security testing
- Desktop and mobile regression testing
- Continuous integration
- Test coverage measurement
- Legacy application modernization
