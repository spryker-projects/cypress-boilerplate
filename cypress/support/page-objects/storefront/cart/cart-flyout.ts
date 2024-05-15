import { AbstractPage } from '../../abstract-page'

export class CartFlyout extends AbstractPage {
  protected PAGE_URL = ''

  getCartFlyoutIcon = (): Cypress.Chainable => {
    return cy.get('cart-counter')
  }
}
