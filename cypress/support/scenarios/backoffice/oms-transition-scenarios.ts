import userCredentials from '../../../fixtures/user-data.json'
import { BackofficeLoginPage } from '../../page-objects/backoffice/login/backoffice-login-page'
import { BackofficeOrderListPage } from '../../page-objects/backoffice/order-management/backoffice-order-list-page'
import { BackofficeOrderDetailsPage } from '../../page-objects/backoffice/order-management/backoffice-order-details-page'
import { isDocker, isLocal } from '../../e2e'

const backofficeLoginPage = new BackofficeLoginPage()
const backofficeOrderListPage = new BackofficeOrderListPage()
const backofficeOrderDetailsPage = new BackofficeOrderDetailsPage()

export class OmsTransitionScenarios {
  /**
   * Triggers OMS transition commands via CLI.
   *
   * @example
   * const omsTransitionScenarios = new OmsTransitionScenarios()
   * omsTransitionScenarios.triggerOmsTransition('path/to/env')
   *   .then(() => {
   *     cy.log('OMS transition triggered.')
   *   })
   */
  triggerOmsTransition = (path = ''): Cypress.Chainable => {
    if (isLocal() || isDocker()) {
      if (isDocker()) {
        // Execute curl commands for Docker environment
        const dockerCliUrl = Cypress.env('DOCKER_CLI_URL')
        const checkConditionCommand = `curl --request POST -LsS --data "APPLICATION_STORE='DE' COMMAND='console oms:check-condition' cli.sh" --max-time 1000 --url "${dockerCliUrl}/console"`
        const checkTimeoutCommand = `curl --request POST -LsS --data "APPLICATION_STORE='DE' COMMAND='console oms:check-timeout' cli.sh" --max-time 1000 --url "${dockerCliUrl}/console"`

        return cy
          .exec(checkConditionCommand, { failOnNonZeroExit: false })
          .its('code')
          .should('eq', 0)
          .then(() =>
            cy.exec(checkTimeoutCommand, { failOnNonZeroExit: false })
          )
          .its('code')
          .should('eq', 0)
      } else {
        // keep in mind that by default exec() command runs commands in the root Cypress tests directly
        // please provide the correct path to your Spryker env
        // and change the validation logic, as default is set not fail on non-zero exit
        const baseCommand = path ? `cd ${path} && docker/sdk` : 'docker/sdk'

        return cy
          .exec(`${baseCommand} console oms:check-condition`, {
            failOnNonZeroExit: false,
          })
          .its('code')
          .should('not.eq', 0)
          .then(() =>
            cy.exec(`${baseCommand} console oms:check-timeout`, {
              failOnNonZeroExit: false,
            })
          )
          .its('code')
          .should('not.eq', 0)
      }
    } else {
      return cy.wrap(null)
    }
  }

  /**
   * Triggers an OMS event for a given order through the UI in back office.
   *
   * @example
   * const omsTransitionScenarios = new OmsTransitionScenarios()
   * omsTransitionScenarios.triggerOmsEvent('DE-1', 'Pay')
   *   .then(() => {
   *     cy.log('OMS event triggered.')
   *   })
   */
  triggerOmsEvent = (
    orderReference: string,
    eventName: string
  ): Cypress.Chainable => {
    return backofficeLoginPage
      .login(
        userCredentials.backofficeUser.email,
        userCredentials.backofficeUser.password
      )
      .then(() => backofficeOrderListPage.visit())
      .then(() => backofficeOrderListPage.viewOrderByReference(orderReference))
      .then(() => backofficeOrderDetailsPage.triggerOms(eventName))
  }

  /**
   * Waits for an order to process to a desired status. Back office UI.
   *
   * @example
   * const omsTransitionScenarios = new OmsTransitionScenarios()
   * omsTransitionScenarios.waitForOrderProcessing('sent to merchant', 10)
   *   .then(() => {
   *     cy.log('Order reached desired status.')
   *   })
   */
  waitForOrderProcessing = (
    desiredStatus: string,
    maxRetries: number
  ): Cypress.Chainable => {
    function findStatusWithText(
      desiredStatus: string,
      retries = 0
    ): Cypress.Chainable {
      if (retries >= maxRetries) {
        throw new Error(
          `Max retries reached while looking for order trigger with text "${desiredStatus}"`
        )
      }
      // Search for the link with the specified order status
      return cy.get('a').then(($links) => {
        const matchingStatus = $links.filter((index, lnk) => {
          return lnk.innerText.includes(desiredStatus)
        })

        if (matchingStatus.length > 0) {
          // Status found, you can perform other tasks or assertions here if needed
          cy.log(`Status "${desiredStatus}" was found`)
          return cy.wrap(matchingStatus) // Return a Cypress.Chainable
        } else {
          // Status not found, reload and try again
          return cy.reload().then(() => {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(10000)
            return findStatusWithText(desiredStatus, retries + 1)
          })
        }
      })
    }

    return findStatusWithText(desiredStatus)
  }
}
