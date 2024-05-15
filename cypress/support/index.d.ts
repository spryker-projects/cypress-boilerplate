declare namespace Cypress {
  interface Chainable {
    /**
     * @example cy.closeAllFlashMessages()
     */
    closeAllFlashMessages(): void

    /**
     * @example cy.createNewCart()
     */
    createNewCart(): void

    /**
     * @example cy.placeOrderViaGlue('sonia@spryker.com','change123','464012',1, 'Dummy Payment', 'Invoice','MER0001')
     */
    placeOrderViaGlue(
      email: string,
      password: string,
      sku: string,
      shipment: number,
      PaymentProvider: string,
      paymentMethod: string,
      merchant: string
    ): Cypress.Chainable<any>

    /**
     * @example cy.triggerOmsTransition()
     */
    triggerOmsTransition(): void
  }
}
