import customerCredentials from '../../fixtures/customer-credentials.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import userCredentials from '../../fixtures/user-credentials.json'
import { BackofficeLoginPage } from '../../support/page-objects/backoffice/login/login-page'
import { OrderListPage } from '../../support/page-objects/backoffice/order-management/order-list-page'
import { OrderDetailsPage } from '../../support/page-objects/backoffice/order-management/order-details-page'
import { OrderDetailsPageScenario } from 'cypress/support/scenarios/glue/checkout'

const login = new BackofficeLoginPage()
const orders = new OrderListPage()
const order = new OrderDetailsPage()
const orderDetailsPageScenario = new OrderDetailsPageScenario()

let orderReference: string

context('Order management', () => {
  before(function () {
    // placing an order for processing
    orderDetailsPageScenario
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

  after(() => {
    cy.checkAndDeleteAllCustomerAddresses(
      customerCredentials.email,
      customerCredentials.password,
      customerCredentials.reference
    )
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
