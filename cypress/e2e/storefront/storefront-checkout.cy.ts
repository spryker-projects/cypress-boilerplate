import customerCredentials from '../../fixtures/customer-data.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import { StorefrontLoginPage } from '../../support/page-objects/storefront/login/storefront-login-page'
import { StorefrontSearchResultsPage } from '../../support/page-objects/storefront/search/storefront-search-results-page'
import { StorefrontProductDetailsPage } from '../../support/page-objects/storefront/product/storefront-product-details-page'
import { StorefrontCartPage } from '../../support/page-objects/storefront/cart/storefront-cart-page'
import { StorefrontCartFlyout } from '../../support/page-objects/storefront/cart/storefront-cart-flyout'
import { StorefrontCheckoutAddressPage } from '../../support/page-objects/storefront/checkout/storefront-checkout-address-page'
import { StorefrontCheckoutShippingPage } from '../../support/page-objects/storefront/checkout/storefront-checkout-shipping-page'
import { StorefrontCheckoutPaymentPage } from '../../support/page-objects/storefront/checkout/storefront-checkout-payment-page'
import { StorefrontCheckoutSummaryPage } from '../../support/page-objects/storefront/checkout/storefront-checkout-summary-page'
import { StorefrontCheckoutSuccessPage } from '../../support/page-objects/storefront/checkout/storefront-checkout-success-page'

const login = new StorefrontLoginPage()
const search = new StorefrontSearchResultsPage()
const product = new StorefrontProductDetailsPage()
const cart = new StorefrontCartPage()
const cartIcon = new StorefrontCartFlyout()
const checkoutAddress = new StorefrontCheckoutAddressPage()
const checkoutShipping = new StorefrontCheckoutShippingPage()
const checkoutPayment = new StorefrontCheckoutPaymentPage()
const checkoutSummary = new StorefrontCheckoutSummaryPage()
const checkoutSuccess = new StorefrontCheckoutSuccessPage()

before(() => {
  // reset customer addresses
  cy.checkAndDeleteAllCustomerAddresses(
    customerCredentials.email,
    customerCredentials.password,
    customerCredentials.reference
  )
  // reset customer carts
  cy.deleteAllShoppingCarts(
    customerCredentials.email,
    customerCredentials.password
  )
})

context('Customer checkout', () => {
  it('can place order on storefront', () => {
    // here we use method from login page object to open login page, enter credentials and login
    login.login(customerCredentials.email, customerCredentials.password)
    cy.createNewCart()
    // here we use search page object to find a product and go to its PDP
    search.findProduct(productData.availableProduct.abstractSku)
    // here we check that the correct product PDP was opened - this is an assertion, other assertions can be added as needed
    product
      .getProductName()
      .should('contain', productData.availableProduct.name)
    product.addProductToCart()
    cartIcon.getCartFlyoutIcon().click()
    // another assertion checking that price in cart is as expected
    cart
      .getCartItem(productData.availableProduct.concreteSku)
      .find('[itemprop="price"]')
      .should('contain', productData.availableProduct.price)
    cart.getCheckoutButton().click()
    checkoutAddress.provideExistingAddress()
    checkoutShipping.provideShipment(checkoutData.storefrontShipment.name)
    checkoutPayment.providePayment(checkoutData.storefrontPayment.name)
    checkoutSummary.completeOrder()
    checkoutSuccess.checkOrderSuccess()
  })
})
