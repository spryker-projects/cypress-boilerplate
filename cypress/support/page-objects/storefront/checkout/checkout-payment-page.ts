import { AbstractPage } from '../../abstract-page'

const paymentForm = 'form[name="paymentForm"]'

export class CheckoutPaymentPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + '/en/checkout/payment'

  selectPaymentMethod = (paymentName: string): void => {
    cy.get(paymentForm).contains(paymentName).click()
  }

  getMarketplaceInvoiceDoBField = (): Cypress.Chainable => {
    return cy
      .get(paymentForm)
      .find('#paymentForm_dummyMarketplacePaymentInvoice_dateOfBirth')
  }

  submitPayment = (): void => {
    cy.get(paymentForm).submit()
  }

  providePayment = (paymentName: string): void => {
    this.selectPaymentMethod(paymentName)
    this.getMarketplaceInvoiceDoBField().type('12.12.1999')
    this.submitPayment()
  }
}
