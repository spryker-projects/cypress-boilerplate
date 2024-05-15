import { AbstractPage } from '../../abstract-page'

const summaryForm = 'form[name="summaryForm"]'

export class CheckoutSummaryPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + 'en/checkout/summary'

  getAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable => {
    return cy.get(summaryForm).find('input[name="acceptTermsAndConditions"]')
  }

  getGrandTotal = (): Cypress.Chainable => {
    return cy.get(summaryForm).find('.summary-overview__item--total')
  }

  submitSummaryForm = (): void => {
    cy.get(summaryForm).submit()
  }

  completeOrder = (): void => {
    this.getAcceptTermsAndConditionsCheckbox().click({ force: true })
    this.submitSummaryForm()
  }
}
