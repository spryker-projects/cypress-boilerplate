import customerCredentials from '../../fixtures/customer-data.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import userCredentials from '../../fixtures/user-data.json'
import { BackofficeLoginPage } from '../../support/page-objects/backoffice/login/backoffice-login-page'
import { BackofficeOrderListPage } from '../../support/page-objects/backoffice/order-management/backoffice-order-list-page'
import { BackofficeOrderDetailsPage } from '../../support/page-objects/backoffice/order-management/backoffice-order-details-page'
import { GlueCheckoutScenarios } from 'cypress/support/scenarios/glue/glue-checkout-scenarios'
import { OmsTransitionScenarios } from '../../support/scenarios/backoffice/oms-transition-scenarios'
import { GlueAddressesScenarios } from '../../support/scenarios/glue/glue-addresses-scenarios'

const backofficeLoginPage = new BackofficeLoginPage()
const backofficeOrderListPage = new BackofficeOrderListPage()
const backofficeOrderDetailsPage = new BackofficeOrderDetailsPage()
const glueCheckoutScenarios = new GlueCheckoutScenarios()
const glueAddressesScenarios = new GlueAddressesScenarios()
const omsTransitionScenarios = new OmsTransitionScenarios()

let orderReference: string

context('Order management', () => {
  before(function () {
    // reset customer addresses
    glueAddressesScenarios.deleteAllCustomerAddresses(
      customerCredentials.email,
      customerCredentials.password,
      customerCredentials.reference
    )
    // placing an order for processing
    glueCheckoutScenarios
      .placeOrder(
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

  it('can trigger OMS events for an order', () => {
    // if the tests are run on an env without active scheduler, we will need to trigger oms transition using CLI commands
    // make sure the location from which you run cypress tests has access to Spryker env
    omsTransitionScenarios.triggerOmsTransition()
    backofficeLoginPage.login(
      userCredentials.backofficeUser.email,
      userCredentials.backofficeUser.password
    )
    backofficeOrderListPage.visit()
    // verify that the order placed in before hook exists in BO as the first order in the list
    backofficeOrderListPage
      .getOrderReference(0)
      .should('have.text', orderReference)
    backofficeOrderListPage.viewOrderByPosition(0)
    // check that price for the product is still as it was in the shop
    backofficeOrderDetailsPage
      .getOrderSubtotal()
      .should('contain', productData.availableOffer.price)
    // clicks the oms trigger with the name 'Pay'
    backofficeOrderDetailsPage.triggerOms('Pay')
    backofficeOrderDetailsPage
      .getSuccessfulOrderMessages()
      .should('contain', 'Status change triggered successfully.')
    backofficeOrderDetailsPage
      .getOrderItemHistory(productData.availableOffer.concreteSku)
      .should('contain', 'tax invoice submitted')
  })

  it('checks customer email in order details page', () => {
    backofficeLoginPage.login(
      userCredentials.backofficeUser.email,
      userCredentials.backofficeUser.password
    )
    backofficeOrderListPage.visit()
    // verify that the order placed in before hook exists in BO as the first order in the list
    backofficeOrderListPage
      .getOrderReference(0)
      .should('have.text', orderReference)
    backofficeOrderListPage.viewOrderByPosition(0)
    // check that customer email is correct on the order details page
    backofficeOrderDetailsPage
      .getCustomerEmail()
      .should('have.text', customerCredentials.email)
  })
})
