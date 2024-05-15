import { SearchPage } from './search-page'

export class SearchSuggestionsFlyout extends SearchPage {
  getSearchSuggestionFlyout = (): Cypress.Chainable => {
    return cy.get('suggest-search')
  }

  getFirstSuggestedProductLink = (): Cypress.Chainable => {
    return this.getSearchSuggestionFlyout().find('a').first()
  }

  findProduct = (searchTerm: string): void => {
    this.getSearchField().type(searchTerm)
    this.getFirstSuggestedProductLink().click()
  }
}
