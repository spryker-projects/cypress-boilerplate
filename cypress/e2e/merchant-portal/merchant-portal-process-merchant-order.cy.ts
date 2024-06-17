import customerCredentials from '../../fixtures/customer-data.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import userCredentials from '../../fixtures/user-data.json'
import { MPLoginPage } from '../../support/page-objects/merchant-portal/login/merchant-portal-login-page'
import { MerchantOrderListPage } from '../../support/page-objects/merchant-portal/order-management/merchant-portal-order-list-page'
import { MerchantOrderDetailsPage } from '../../support/page-objects/merchant-portal/order-management/merchant-portal-order-details-page'

const login = new MPLoginPage()
const orders = new MerchantOrderListPage()
const order = new MerchantOrderDetailsPage()

let orderReference: string

context('Merchant Order management', () => {
  before(function () {
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

  after(() => {
    cy.checkAndDeleteAllCustomerAddresses(
      customerCredentials.email,
      customerCredentials.password,
      customerCredentials.reference
    )
  })

  it('merchant can process orders', () => {
    cy.triggerOmsEvent(orderReference, 'Pay')
    // if the tests are run on an env without active scheduler, e.g. local env, we will need to trigger oms transition using CLI commands
    // make sure the location from which you run cypress tests has access to Spryker env
    if (Cypress.env('environment') === 'local') {
      cy.triggerOmsTransition()
      cy.waitForOrderProcessing('sent to merchant', 20)
    } else {
      //wait till order is processed on environment with enables scheduler i.e. cloud environment
      cy.waitForOrderProcessing('sent to merchant', 20)
    }
    //process order in merchant portal
    login.login(
      userCredentials.merchantPortalUser.email,
      userCredentials.merchantPortalUser.password
    )
    orders.visit()
    // verify that the order placed in before hook exists and was passed to merchant
    orders.getOrderReference(0).should('contain.text', orderReference)
    orders.viewOrderByPosition(0)
    // check that price for the product is still as it was in the shop
    order
      .getOrderSubTotals()
      .should('contain', productData.availableOffer.price)
    // clicks the oms trigger with the name 'Pay'
    order.triggerOms('Ship')
    order.getOrderItemsStates().should('contain', 'Shipped')
    order.openOrderTab('Items')
    order
      .getOrderItemState(productData.availableOffer.concreteSku)
      .should('contain', 'shipped')
  })
})
