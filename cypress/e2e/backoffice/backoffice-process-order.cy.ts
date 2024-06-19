import customerCredentials from '../../fixtures/customer-data.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import userCredentials from '../../fixtures/user-data.json'
import { BackofficeLoginPage } from '../../support/page-objects/backoffice/login/backoffice-login-page'
import { BackofficeOrderListPage } from '../../support/page-objects/backoffice/order-management/backoffice-order-list-page'
import { BackofficeOrderDetailsPage } from '../../support/page-objects/backoffice/order-management/backoffice-order-details-page'

const login = new BackofficeLoginPage()
const orders = new BackofficeOrderListPage()
const order = new BackofficeOrderDetailsPage()

let orderReference: string

context('Order management', () => {
  before(function () {
    // reset customer addresses
    cy.checkAndDeleteAllCustomerAddresses(
      customerCredentials.email,
      customerCredentials.password,
      customerCredentials.reference
    )
    // placing an order for processing
    cy.placeOrderViaGlue(
      customerCredentials.email,
      customerCredentials.password,
      productData.availableOffer.concreteSku,
      checkoutData.glueShipment.id,
      checkoutData.gluePayment.providerName,
      checkoutData.gluePayment.methodName,
      productData.availableOffer.offer,
      productData.availableOffer.merchantReference
    ).then((response: string) => {
      orderReference = response
    })
  })

  it('can trigger OMS events for an order', () => {
    // if the tests are run on an env without active scheduler, we will need to trigger oms transition using CLI commands
    // make sure the location from which you run cypress tests has access to Spryker env
    if (Cypress.env('environment') === 'local') {
      cy.triggerOmsTransition()
    }
    login.login(
      userCredentials.backofficeUser.email,
      userCredentials.backofficeUser.password
    )
    orders.visit()
    // verify that the order placed in before hook exists in BO as the first order in the list
    orders.getOrderReference(0).should('have.text', orderReference)
    orders.viewOrderByPosition(0)
    // check that price for the product is still as it was in the shop
    order.getOrderSubtotal().should('contain', productData.availableOffer.price)
    // clicks the oms trigger with the name 'Pay'
    order.triggerOms('Pay')
    order
      .getSuccessfulOrderMessages()
      .should('contain', 'Status change triggered successfully.')
    order
      .getOrderItemHistory(productData.availableOffer.concreteSku)
      .should('contain', 'tax invoice submitted')
  })
})
