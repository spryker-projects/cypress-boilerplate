import { AbstractPage } from '../../abstract-page'

export class CheckoutSuccessPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + '/en/checkout/success'

  checkOrderSuccess = (): void => {
    cy.url().should('contain', this.PAGE_URL)
  }
}
