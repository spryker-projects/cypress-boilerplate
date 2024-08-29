import customerCredentials from '../../fixtures/customer-data.json'
import { StorefrontLoginPage } from '../../support/page-objects/storefront/login/storefront-login-page'
import { StorefrontQuickOrderPage } from '../../support/page-objects/storefront/quick-order/storefront-quick-order-page'
import quickOrderData from '../../fixtures/quick-order-data.json'
import { StorefrontCartPage } from '../../support/page-objects/storefront/cart/storefront-cart-page'
import { StorefrontQuickOrderScenarios } from '../../support/scenarios/storefront/storefront-quick-order-scenarios'

const storefrontLoginPage = new StorefrontLoginPage()
const storefrontCartPage = new StorefrontCartPage()
const storefrontQuickOrderPage = new StorefrontQuickOrderPage()

const storefrontQuickOrderScenarios = new StorefrontQuickOrderScenarios()

context('Quick order', () => {
  beforeEach(() => {
    cy.deleteAllShoppingCarts(
      customerCredentials.email,
      customerCredentials.password
    )

    storefrontLoginPage.login(
      customerCredentials.email,
      customerCredentials.password
    )

    storefrontQuickOrderPage.visit()
  })

  it('can add product to cart', () => {
    storefrontQuickOrderScenarios.addProduct(
      quickOrderData.product.sku,
      quickOrderData.product.quantity,
    )
    storefrontQuickOrderPage.addToCart()

    storefrontCartPage.getCartItemsList()
      .should('contain', quickOrderData.product.sku)
  })

  it('can add filtered by merchant product to cart', () => {
    storefrontQuickOrderPage.selectMerchant(quickOrderData.merchantName)

    storefrontQuickOrderScenarios.addProduct(
      quickOrderData.product.sku,
      quickOrderData.product.quantity,
    )
    storefrontQuickOrderPage.addToCart()

    storefrontCartPage.getCartItemsList()
      .should('contain', quickOrderData.product.sku)
  })

  it('can add product for checkout', () => {
    storefrontQuickOrderScenarios.addProduct(
      quickOrderData.product.sku,
      quickOrderData.product.quantity,
    )

    storefrontQuickOrderPage.createOrder()
  })
})