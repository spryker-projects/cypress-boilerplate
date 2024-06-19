import customerCredentials from '../../fixtures/customer-data.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import userCredentials from '../../fixtures/user-data.json'
import { BackofficeLoginPage } from '../../support/page-objects/backoffice/login/backoffice-login-page'
import { BackofficeOrderListPage } from '../../support/page-objects/backoffice/order-management/backoffice-order-list-page'
import { BackofficeOrderDetailsPage } from '../../support/page-objects/backoffice/order-management/backoffice-order-details-page'
import { CheckoutScenario } from 'cypress/support/scenarios/glue/checkout'

const login = new BackofficeLoginPage()
const orders = new BackofficeOrderListPage()
const order = new BackofficeOrderDetailsPage()
const checkoutScenario = new CheckoutScenario()

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
    checkoutScenario
      .checkout(
        customerCredentials.email,
        customerCredentials.password,
        productData.availableOffer.concreteSku,
        checkoutData.glueShipment.id,
        checkoutData.gluePayment.providerName,
        checkoutData.gluePayment.methodName,
        productData.availableOffer.offer,
        productData.availableOffer.merchantReference
      )
      .then((response: string) => {
        orderReference = response
      })
  })

  it('checks customer email in order details page', () => {
    login.login(
      userCredentials.backofficeUser.email,
      userCredentials.backofficeUser.password
    )
    orders.visit()
    // verify that the order placed in before hook exists in BO as the first order in the list
    orders.getOrderReference(0).should('have.text', orderReference)
    orders.viewOrderByPosition(0)
    // check that customer email is correct on the order details page
    order.getCustomerEmail().should('have.text', customerCredentials.email)
  })
})
