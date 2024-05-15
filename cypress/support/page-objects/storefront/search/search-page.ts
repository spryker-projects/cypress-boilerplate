import { AbstractPage } from '../../abstract-page'

export class SearchPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + '/en/search'

  getSearchField = (): Cypress.Chainable => {
    return cy.get('header').find('input[name="q"]')
  }
}
