import { AbstractPage } from '../../abstract-page'

export class StorefrontCartPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + '/en/cart'

  getCartItemsList = (): Cypress.Chainable => {
    return cy.get('cart-items-list')
  }

  getCartItem = (concreteSku: string): Cypress.Chainable => {
    return this.getCartItemsList()
      .contains('span[itemprop="sku"]', concreteSku)
      .parents('article.product-cart-item')
  }

  getCheckoutButton = (): Cypress.Chainable => {
    return cy.get('[data-qa="cart-go-to-checkout"]')
  }
}
