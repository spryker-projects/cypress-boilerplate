import userCredentials from '../../../fixtures/user-credentials.json'
import { BackofficeLoginPage } from '../../page-objects/backoffice/login/login-page'
import { OrderListPage } from '../../page-objects/backoffice/order-management/order-list-page'
import { OrderDetailsPage } from '../../page-objects/backoffice/order-management/order-details-page'

const login = new BackofficeLoginPage()
const orders = new OrderListPage()
const order = new OrderDetailsPage()

Cypress.Commands.add('triggerOmsTransition', (path = '') => {
  // keep in mind that by default exec() command runs commands in the root Cypress tests directly
  // please provide the correct path to your Spryker env
  // and change the validation logic, as default is set not fail on non-zero exit
  const baseCommand = path ? `cd ${path} && docker/sdk` : 'docker/sdk'
  cy.exec(`${baseCommand} console oms:check-condition`, {
    failOnNonZeroExit: false,
  })
    .its('code')
    .should('not.eq', 0)
  cy.exec(`${baseCommand} console oms:check-timeout`, {
    failOnNonZeroExit: false,
  })
    .its('code')
    .should('not.eq', 0)
})

Cypress.Commands.add(
  'triggerOmsEvent',
  (orderReference: string, eventName: string) => {
    login.login(
      userCredentials.backofficeUser.email,
      userCredentials.backofficeUser.password
    )
    orders.visit()
    orders.viewOrderByReference(orderReference)
    order.triggerOms(eventName)
  }
)

Cypress.Commands.add(
  'waitForOrderProcessing',
  (desiredStatus: string, maxRetries: number) => {
    function findStatusWithText(desiredStatus: string, retries = 0) {
      if (retries >= maxRetries) {
        throw new Error(
          `Max retries reached while looking for order trigger with text "${desiredStatus}"`
        )
      }

      // Search for the link with the specified order status
      cy.get('a').then(($links) => {
        const matchingStatus = $links.filter((index, lnk) => {
          return lnk.innerText.includes(desiredStatus)
        })

        if (matchingStatus.length > 0) {
          // Status found, you can perform other tasks or assertions here if needed
          cy.log(`Status "${desiredStatus}" was found`)
        } else {
          // Status not found, reload and try again
          /* eslint-disable */
          cy.reload().then(() => {
            cy.wait(10000)
            findStatusWithText(desiredStatus, retries + 1)
          })
          /* eslint-enable */
        }
      })
    }

    findStatusWithText(desiredStatus)
  }
)
