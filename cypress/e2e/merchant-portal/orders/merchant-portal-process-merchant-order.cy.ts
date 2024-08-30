import customerCredentials from '@fixtures/customer-data.json'
import productData from '@fixtures/product-data.json'
import checkoutData from '@fixtures/checkout-data.json'
import userCredentials from '@fixtures/user-data.json'
import { MerchantLoginPage } from '@support/page-objects/merchant-portal/login/merchant-portal-login-page'
import { MerchantOrderListPage } from '@support/page-objects/merchant-portal/order-management/merchant-portal-order-list-page'
import { MerchantOrderDetailsPage } from '@support/page-objects/merchant-portal/order-management/merchant-portal-order-details-page'
import { GlueCheckoutScenarios } from '@support/scenarios/glue/glue-checkout-scenarios'
import { GlueAddressesScenarios } from '@support/scenarios/glue/glue-addresses-scenarios'
import { OmsTransitionScenarios } from '@support/scenarios/backoffice/oms-transition-scenarios'
import { GlueCartsScenarios } from '@support/scenarios/glue/glue-carts-scenarios'

const merchantLoginPage = new MerchantLoginPage()
const merchantOrderListPage = new MerchantOrderListPage()
const merchantOrderDetailsPage = new MerchantOrderDetailsPage()
const glueCheckoutScenarios = new GlueCheckoutScenarios()
const glueAddressesScenarios = new GlueAddressesScenarios()
const omsTransitionScenarios = new OmsTransitionScenarios()
const glueCartsScenarios = new GlueCartsScenarios()

let orderReference: string

context('Merchant Order management', () => {
  before(function () {
    // reset customer addresses
    glueAddressesScenarios.deleteAllCustomerAddresses(
      customerCredentials.email,
      customerCredentials.password,
      customerCredentials.reference
    )
    // reset customer carts
    glueCartsScenarios.deleteAllShoppingCarts(
      customerCredentials.email,
      customerCredentials.password
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

  it('merchant can process orders', () => {
    // if the tests are run on an env without active scheduler, we will need to trigger oms transition using CLI commands
    // make sure the location from which you run cypress tests has access to Spryker env
    omsTransitionScenarios.triggerOmsTransition()
    omsTransitionScenarios.triggerOmsEvent(orderReference, 'Pay')
    // if the tests are run on an env without active scheduler, e.g. local env, we will need to trigger oms transition using CLI commands
    // make sure the location from which you run cypress tests has access to Spryker env
    omsTransitionScenarios.triggerOmsTransition()
    omsTransitionScenarios.waitForOrderProcessing('sent to merchant', 20)
    //process order in merchant portal
    merchantLoginPage.login(
      userCredentials.merchantPortalUser.email,
      userCredentials.merchantPortalUser.password
    )
    merchantOrderListPage.visit()
    // verify that the order placed in before hook exists and was passed to merchant
    merchantOrderListPage
      .getOrderReference(0)
      .should('contain.text', orderReference)
    merchantOrderListPage.viewOrderByPosition(0)
    // check that price for the product is still as it was in the shop
    merchantOrderDetailsPage
      .getOrderSubTotals()
      .should('contain', productData.availableOffer.price)
    // clicks the oms trigger with the name 'Pay'
    merchantOrderDetailsPage.triggerOms('Ship')
    merchantOrderDetailsPage.getOrderItemsStates().should('contain', 'Shipped')
    merchantOrderDetailsPage.openOrderTab('Items')
    merchantOrderDetailsPage
      .getOrderItemState(productData.availableOffer.concreteSku)
      .should('contain', 'shipped')
  })
})
