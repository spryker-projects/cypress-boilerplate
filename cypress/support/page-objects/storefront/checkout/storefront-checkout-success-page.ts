import { AbstractPage } from '../../abstract-page'

export class StorefrontCheckoutSuccessPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + '/en/checkout/success'

  checkOrderSuccess = (): void => {
    // Allow optional single path segment (e.g. /DE/en/checkout/success or /DE-AT/en/checkout/success)
    cy.location('pathname').should('match', /^\/([^\/]+\/)?en\/checkout\/success$/)
  }
}
