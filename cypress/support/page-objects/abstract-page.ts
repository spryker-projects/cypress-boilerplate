import VisitOptions = Cypress.VisitOptions

export class AbstractPage {
  protected PAGE_URL = ''
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visit(this.PAGE_URL, options)
  }
}
