## Description

This is a boilerplate for Cypress tests, designed to be compatible with Spryker Marketplace B2B.
It should be used as the starting point for creating project-specific tests for your Spryker solution.
It includes examples of:

- Yves tests - checkout process
- Backoffice tests - order management process
- Merchant Portal tests - order management process
- Glue API tests - checkout process with response schema validation

It also illustrates the following testing patterns and capabilities as:

- Page Objects
- Cypress custom commands
- Using CLI commands from within cypress
- Using static fixtures
- Running tests on different environments
- Generating HTML report

## Setup

To get started with these tests, follow these setup steps:

1. **Install Dependencies:**

- Install all necessary dependencies required for running the tests.
  ```bash
  npm install
  ```

2. **Environment Configuration:**

- The available environments on which you want to run tests are listed in `.envs` directory.
- For each environment there should be a separate file with name `.env.<env_name>`, f.e. `.env.staging`
- If you need to add a new environment, you should add new file in `.envs` folder and also add your environment name to `cypress.config.ts` - `environments` variable
- Inside the file there should be URLs for Yves, Backoffice and GLUE
- If you need other sensitive env-dependent variables, you can create `.env` file where you can add these variables and which can be excluded from source control

## Running Tests

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
Run all tests from `docker/sdk` in a headless mode vs `local` environment without using Cypress UI

```bash
docker/sdk exec cypress npm run cy:run:docker
```

Run code formatting checks

```bash
npm run code:check
```

Fix code formatting

```bash
npm run code:fix
```

## Report

After test execution, an HTML report will be automatically generated and available under `cypress/data/reports`
