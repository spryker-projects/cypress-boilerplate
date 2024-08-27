## Description

This repository provides a Cypress boilerplate to help you quickly set up and run end-to-end (E2E) tests for Spryker projects, including but not limited to Marketplace B2B. It offers a solid foundation for creating custom test suites, ensuring scalability and maintainability. While this boilerplate doesn't include pre-built tests for all scenarios, it equips you with the tools and structure needed to implement Cypress E2E tests in your own project, regardless of the business model.
### Key Features

- **Comprehensive Test Coverage:**
  - **Yves:** Example tests for the checkout process.
  - **Backoffice:** Example tests for order management.
  - **Merchant Portal:** Example tests for order management.
  - **Glue API:** Example tests for the checkout process including response schema validation, ensuring that API responses adhere to the expected format.

- **Page Objects:** 
  - Utilizes the Page Object pattern to promote code reuse and simplify test maintenance.

- **Custom Commands and Scenarios:**
  - Includes Cypress custom commands and scenarios to streamline repetitive actions in tests.

- **CLI Commands from Within Cypress:**
  - Execute CLI commands directly from within Cypress tests for enhanced control and flexibility.
 
- **Static Fixtures:** 
  - Uses static fixtures to manage test data effectively, ensuring consistency and reliability in test execution.

- **Environment Configurations:**
  - Supports running tests across multiple environments (local, staging, production) with minimal configuration changes.

- **Docker Integration:**
  - Seamlessly integrates with Docker using Spryker `docker/sdk`, allowing tests to be executed within a containerized environment.

- **Continuous Integration (CI):**
  - Easily integrates with CI pipelines for automated test execution, including detailed reporting.

- **Naming Conventions:**
  - Adopts standardized naming conventions for test files, Page Objects, and other assets to maintain consistency across the project.

- **Code Quality Tools:**
  - Includes ESLint and Prettier for maintaining code quality and consistency across the test suite.

- **Reporting:**
  - Automated HTML reports generated post-test execution to keep track of test results.

## Getting Started

To get started with this Cypress boilerplate, follow these steps:

### 1. Install Dependencies

Install all necessary dependencies required for running the tests.

```bash
npm install
  ```
### 2. Environment Configuration:

- The available environments on which you want to run tests are listed in `.envs` directory.
- For each environment there should be a separate file with name `.env.<env_name>`, f.e. `.env.staging`
- If you need to add a new environment, you should add new file in `.envs` folder and also add your environment name to `cypress.config.ts` - `environments` variable
- Inside the file there should be URLs for Yves, Backoffice and GLUE
- If you need other sensitive env-dependent variables, you can create `.env` file where you can add these variables and which can be excluded from source control

### 3. Running Tests

To open the Cypress tests in Cypress UI - Cypress test runner, use the following command and supply the name of the environment.
If environment is not provided at launch, by default `local` environment will be used, so this example if for opening tests against `local` environment:

```bash
npx cypress open
```

And this is and example of opening tests against `staging` environment:

```bash
npx cypress open --env environment=staging
```

To run all tests in a headless mode without using Cypress UI, use the following command. Again, if no environment is provided, `local` is used.
This example is for `staging` environment:

```bash
npx cypress run --env environment=staging
```

Run all tests in a headless mode vs `local` environment without using Cypress UI

```bash
npm run cy:run
```

Run all tests within `docker/sdk` in a headless mode vs `local` environment without using Cypress UI

```bash
docker/sdk exec cypress npm run cy:run:docker
```

### 4. Code Quality Checks

Run code formatting checks

```bash
npm run code:check
```

Fix code formatting

```bash
npm run code:fix
```

### 5. Test Reports

After test execution, an HTML report will be automatically generated and available under `cypress/data/reports`

## Additional Resources

For detailed guides, best practices, and how-to articles, please refer to our [Wiki](https://github.com/spryker-projects/cypress-boilerplate/wiki).
