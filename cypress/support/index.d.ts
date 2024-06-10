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
     * @example cy.placeOrderViaGlue('sonia@spryker.com','change123','464012',1, 'Dummy Payment', 'Invoice', 'offer123', 'MER0001')
     */
    placeOrderViaGlue(
      email: string,
      password: string,
      sku: string,
      shipment: number,
      paymentProvider: string,
      paymentMethod: string,
      offer: string,
      merchant: string
    ): Cypress.Chainable<any>

    /**
     * * @example cy.triggerOmsTransition('/path/to/spryker/env')
     */
    triggerOmsTransition(path?: string): void

    checkAndDeleteAllCustomerAddresses(
      email: string,
      password: string,
      customerReference: string
    ): void

    deleteAllShoppingCarts(email: string, password: string): void

    /**
     * * @example cy.sendOrderToMerchant('DE--1')
     */
    sendOrderToMerchant(orderReference: string): void

    /**
     * * @example cy.sendOrderToMerchant(''sent to merchant', 20)
     */
    waitForOrderProcessing(desiredStatus: string, maxRetries: number): void
  }
}
