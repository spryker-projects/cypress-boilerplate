import { GlueRequest } from '../glue-request'

export class Items extends GlueRequest {
  protected ENDPOINT_NAME = ''
  protected GLUE_ENDPOINT = ''

  private setEndpoint(cartId: string): void {
    this.ENDPOINT_NAME = `/carts/${cartId}/items`
    this.GLUE_ENDPOINT = this.GLUE_DOMAIN + this.ENDPOINT_NAME
  }

  addItemToCart = (
    token: string,
    cartId: string,
    sku: string,
    qty: number
  ): Cypress.Chainable => {
    this.setEndpoint(cartId)

    return cy.api({
      method: 'POST',
      url: this.GLUE_ENDPOINT,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: {
        data: {
          type: 'items',
          attributes: {
            sku: sku,
            quantity: qty,
          },
        },
      },
      failOnStatusCode: false,
    })
  }

  addOfferToCart = (
    token: string,
    cartId: string,
    sku: string,
    qty: number,
    merchant: string
  ): Cypress.Chainable => {
    this.setEndpoint(cartId)

    return cy.api({
      method: 'POST',
      url: this.GLUE_ENDPOINT,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: {
        data: {
          type: 'items',
          attributes: {
            sku: sku,
            quantity: qty,
            merchantReference: merchant,
          },
        },
      },
      failOnStatusCode: false,
    })
  }
}
