import { AbstractPage } from '../../abstract-page'

const loginForm = 'form[name="security-merchant-portal-gui"]'

export class MPLoginPage extends AbstractPage {
  protected PAGE_URL =
    Cypress.env('MP_URL') + '/security-merchant-portal-gui/login'

  getEmailField = (): Cypress.Chainable => {
    return cy.get(loginForm).find('#security-merchant-portal-gui_username')
  }

  getPasswordField = (): Cypress.Chainable => {
    return cy.get(loginForm).find('#security-merchant-portal-gui_password')
  }

  login = (email: string, password: string): void => {
    this.visit()
    this.getEmailField().clear()
    this.getEmailField().type(email)
    this.getPasswordField().clear()
    this.getPasswordField().type(password)
    cy.get(loginForm).submit()
  }
}
