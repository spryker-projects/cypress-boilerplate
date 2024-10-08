import customerCredentials from '@fixtures/customer-data.json'
import productData from '@fixtures/product-data.json'
import checkoutData from '@fixtures/checkout-data.json'
import { StorefrontLoginPage } from '@support/page-objects/storefront/login/storefront-login-page'
import { StorefrontCustomerOverviewPage } from '@support/page-objects/storefront/customer/storefront-customer-overview-page'
import { StorefrontCustomerOrderDetailsPage } from '@support/page-objects/storefront/customer/storefront-customer-order-details-page'
import { GlueAddressesScenarios } from '@support/scenarios/glue/glue-addresses-scenarios'
import { GlueCartsScenarios } from '@support/scenarios/glue/glue-carts-scenarios'

const glueAddressesScenarios = new GlueAddressesScenarios()
const glueCartsScenarios = new GlueCartsScenarios()
const storefrontLoginPage = new StorefrontLoginPage()
const storefrontCustomerOverviewPage = new StorefrontCustomerOverviewPage()
const storefrontCustomerOrderDetailsPage =
  new StorefrontCustomerOrderDetailsPage()

let orderGrandTotal: object
let orderReference: string
context('Customer orders', () => {
  before(() => {
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
      // getting order grand total for further comparison
      cy.getCustomerOrder(
        customerCredentials.email,
        customerCredentials.password,
        response
      ).then((order: object) => {
        orderGrandTotal = order.totals.grandTotal
      })
    })
  })

  it('can see placed order in orders table', () => {
    // login as a customer
    storefrontLoginPage.login(
      customerCredentials.email,
      customerCredentials.password
    )
    // open customer overview page and assert order table is visible
    storefrontCustomerOverviewPage.visit()
    storefrontCustomerOverviewPage.getOrdersTable().should('be.visible')

    // assert that the first order row contains the correct grand total of the order
    cy.formatDisplayPrice(orderGrandTotal).then((formattedGrandTotal) => {
      storefrontCustomerOverviewPage
        .getFirstOrderRowPrice()
        .should('contain', formattedGrandTotal)
    })
  })

  it('can open order details page', () => {
    // login as a customer
    storefrontLoginPage.login(
      customerCredentials.email,
      customerCredentials.password
    )

    // open customer overview page and click on the first view order button
    storefrontCustomerOverviewPage.visit()
    storefrontCustomerOverviewPage.getFirstOrderViewActionButton().click()

    // assert we are on the correct order details page
    storefrontCustomerOrderDetailsPage.getPageTitle().contains('Order Details')
    storefrontCustomerOrderDetailsPage
      .getOrderInfoBlockOrderReference()
      .should('contain', orderReference)

    // assert that the order grand total is displayed correctly in summary
    cy.formatDisplayPrice(orderGrandTotal).then((formattedGrandTotal) => {
      storefrontCustomerOrderDetailsPage
        .getOrderSummaryGrandTotal()
        .should('contain', formattedGrandTotal)
    })
  })
})
