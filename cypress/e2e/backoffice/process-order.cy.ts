import customerCredentials from '../../fixtures/customer-credentials.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import userCredentials from '../../fixtures/user-credentials.json'
import { BackofficeLoginPage } from '../../support/page-objects/backoffice/login/login-page'
import { OrderListPage } from '../../support/page-objects/backoffice/order-management/order-list-page'
import { OrderDetailsPage } from '../../support/page-objects/backoffice/order-management/order-details-page'

const login = new BackofficeLoginPage()
const orders = new OrderListPage()
const order = new OrderDetailsPage()

let orderReference: string

context('Order management', () => {
  before(function () {
    // placing an order for processing
    cy.placeOrderViaGlue(
      customerCredentials.email,
      customerCredentials.password,
      productData.availableProduct.concreteSku,
      checkoutData.glueShipment.id,
      checkoutData.gluePayment.providerName,
      checkoutData.gluePayment.methodName,
      productData.availableProduct.merchantReference
    ).then((response: string) => {
      orderReference = response
    })
  })

  after(() => {
    cy.checkAndDeleteAllCustomerAddresses(
      customerCredentials.email,
      customerCredentials.password,
      customerCredentials.reference
    )
  })

  it('can trigger OMS events for an order', () => {
    // if the tests are run on an env without active scheduler, we will need to trigger oms transition using CLI commands
    // make sure the location from which you run cypress tests has access to Spryker env
    if (Cypress.env('environment') === 'local') {
      cy.triggerOmsTransition()
    }
    login.login(userCredentials.email, userCredentials.password)
    orders.visit()
    // verify that the order placed in before hook exists in BO as the first order in the list
    orders.getOrderReference(0).should('have.text', orderReference)
    orders.viewOrder(0)
    // check that price for the product is still as it was in the shop
    order
      .getOrderSubtotal()
      .should('contain', productData.availableProduct.price)
    // clicks the oms trigger with the name 'Pay'
    order.triggerOms('Pay')
    order
      .getSuccessfulOrderMessages()
      .should('contain', 'Status change triggered successfully.')
    order
      .getOrderItemHistory(productData.availableProduct.concreteSku)
      .should('contain', 'tax invoice submitted')
  })
})
