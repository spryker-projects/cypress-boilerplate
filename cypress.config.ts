import { defineConfig } from 'cypress'
import * as fs from 'fs'
import { config as dotenvConfig } from 'dotenv'

module.exports = defineConfig({
  watchForFileChanges: false,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  projectId: 'yvdmdz',
  chromeWebSecurity: false,
  video: false,
  downloadsFolder: 'cypress/data/downloads',
  fileServerFolder: 'cypress/e2e',
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/data/screenshots',
  videosFolder: 'cypress/data/videos',
  supportFolder: 'cypress/support',
  experimentalModifyObstructiveThirdPartyCode: true,
  pageLoadTimeout: 60000,
  viewportWidth: 1280,
  viewportHeight: 800,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportTitle: 'mochawesome-report',
    // reportFilename: '[status]_[datetime]-report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/data/reports',
    showSkipped: true,
  },
  e2e: {
    supportFile: 'cypress/support/e2e.ts',

    setupNodeEvents: (on, config) => {
      require('cypress-mochawesome-reporter/plugin')(on)
      on('task', {})
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // ENVIRONMENT SETUP
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Use testing as the default environment to run E2E tests on
      let environment = 'local'

      // When the environment is set, use this environment. This can be set via the command line `npx cypress run --env environment=staging`
      // Possible options are: local, testing, staging, production
      const environments = ['local', 'testing', 'staging', 'production']

      if (typeof config.env.environment !== 'undefined') {
        environment = config.env.environment
      }

      if (!environments.includes(environment)) {
        throw new Error(
          `Invalid environment: ${environment}, allowed environments are: ${environments.join(', ')}`
        )
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // ENVIRONMENT VARIABLES (default)
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const envVars = dotenvConfig({
        path: process.cwd() + '/.env',
      })

      if (envVars.error) {
        throw envVars.error
      }

      // Iterate over each var and pass it to config.env use the key as key and the value as value
      for (const key in envVars.parsed) {
        config.env[key] = envVars.parsed[key]
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // ENVIRONMENT VARIABLES (for environment e.g. staging)
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const envFileNameForEnvironment = process.cwd() + `/.${environment}`
      if (fs.existsSync(envFileNameForEnvironment)) {
        const envVarsForEnvironment = dotenvConfig({
          path: envFileNameForEnvironment,
        })

        if (envVarsForEnvironment.error) {
          throw envVarsForEnvironment.error
        }

        // Iterate over each var and pass it to config.env use the key as key and the value as value
        for (const key in envVarsForEnvironment.parsed) {
          if (!(key in config.env)) {
            config.env[key] = envVarsForEnvironment.parsed[key]
          }
        }
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // ENVIRONMENT SETUP
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Define the environment file to use
      const envFileName = process.cwd() + `/.envs/.env.${environment}`

      const result = dotenvConfig({ path: envFileName })

      if (result.error) {
        throw result.error
      }

      // Iterate over each var and pass it to config.env use the key as key and the value as value
      for (const key in result.parsed) {
        if (!(key in config.env)) {
          config.env[key] = result.parsed[key]
        }
      }

      // Set GLUE_URL as baseUrl from the loaded environment variables
      config.baseUrl = config.env.GLUE_URL

      return config
    },
  },
  retries: {
    // Retry attempts for `cypress run`
    runMode: 2,
    // Retry attempts for `cypress open`
    openMode: 0,
  },

  env: {
    // default environment is used as a fallback
    DEFAULT_ENVIRONMENT: 'local',
  },
})

export default defineConfig
