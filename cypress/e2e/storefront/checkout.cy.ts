import customerCredentials from '../../fixtures/customer-credentials.json'
import productData from '../../fixtures/product-data.json'
import checkoutData from '../../fixtures/checkout-data.json'
import { StorefrontLoginPage } from '../../support/page-objects/storefront/login/login-page'
import { SearchResultsPage } from '../../support/page-objects/storefront/search/search-results-page'
import { ProductDetailsPage } from '../../support/page-objects/storefront/product/product-details-page'
import { CartPage } from '../../support/page-objects/storefront/cart/cart-page'
import { CartFlyout } from '../../support/page-objects/storefront/cart/cart-flyout'
import { CheckoutAddressPage } from '../../support/page-objects/storefront/checkout/checkout-address-page'
import { CheckoutShippingPage } from '../../support/page-objects/storefront/checkout/checkout-shipping-page'
import { CheckoutPaymentPage } from '../../support/page-objects/storefront/checkout/checkout-payment-page'
import { CheckoutSummaryPage } from '../../support/page-objects/storefront/checkout/checkout-summary-page'
import { CheckoutSuccessPage } from '../../support/page-objects/storefront/checkout/checkout-success-page'

const login = new StorefrontLoginPage()
const search = new SearchResultsPage()
const product = new ProductDetailsPage()
const cart = new CartPage()
const cartIcon = new CartFlyout()
const checkoutAddress = new CheckoutAddressPage()
const checkoutShipping = new CheckoutShippingPage()
const checkoutPayment = new CheckoutPaymentPage()
const checkoutSummary = new CheckoutSummaryPage()
const checkoutSuccess = new CheckoutSuccessPage()

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
