## Description

This repository provides a comprehensive boilerplate designed to help developers and QA engineers quickly integrate the Cypress E2E testing framework into their Spryker projects, including support for Marketplace B2B and other business models. While it doesn't come with a full set of automated tests out of the box, it offers a strong foundation for building custom test suites. The repository also includes detailed guides, best practices, and real examples in the [Wiki](https://github.com/spryker-projects/cypress-boilerplate/wiki) section to help you optimize and streamline your Cypress implementation for end-to-end testing.

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
- For each environment, there should be a separate file with the name `.env.<env_name>`, f.e. `.env.staging`
- If you need to add a new environment, you should add a new file in `.envs` folder and also add your environment name to `cypress.config.ts` - `environments` variable
- Inside the file, there should be URLs for your Yves, Backoffice, and Glue
- If you need other sensitive env-dependent variables, you can create `.env` file where you can add these variables which can be excluded from the source control

### 3. Running Tests

To open the Cypress tests in Cypress UI - [Cypress App](https://docs.cypress.io/guides/core-concepts/cypress-app), use the following command and supply the name of the environment.
If the environment is not provided at launch, by default `local` environment will be used, so this example is for opening tests against `local` environment:

```bash
npx cypress open
```

And this is an example of opening tests against `staging` environment:

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

❗ **If you are new to Cypress:**

* Start with [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress) and go through the **Core Concepts** section.
* Understand [Testing Types](https://docs.cypress.io/guides/core-concepts/testing-types).
* Get familiar with [Best Practices](https://docs.cypress.io/guides/references/best-practices) for working with Cypress.
* Explore learning resources at [Cypress Learning Center](https://learn.cypress.io/).

