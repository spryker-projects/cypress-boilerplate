import { AccessToken } from 'cypress/support/glue-endpoints/authentication/access-token'
import { Carts } from 'cypress/support/glue-endpoints/cart/carts'
import { Items } from 'cypress/support/glue-endpoints/cart/items'
import { Checkout } from 'cypress/support/glue-endpoints/checkout/checkout'

const tokenEndpoint = new AccessToken()
const cartEndpoint = new Carts()
const itemsEndpoint = new Items()
const checkoutEndpoint = new Checkout()

Cypress.Commands.add(
  'placeOrderViaGlue',
  (
    email: string,
    password: string,
    sku: string,
    shipment: number,
    paymentProvider: string,
    paymentMethod: string,
    merchant: string
  ) => {
    let token: string
    let cartId: string

    return tokenEndpoint
      .getCustomerAccessToken(email, password)
      .then((response) => {
        token = response.body.data.attributes.accessToken
        return token
      })
      .then((token) => {
        return cartEndpoint.createGrossCart(token).then((response) => {
          cartId = response.body.data.id
          return { token, cartId }
        })
      })
      .then(({ token, cartId }) => {
        return itemsEndpoint
          .addOfferToCart(token, cartId, sku, 1, merchant)
          .then(() => {
            return { token, cartId }
          })
      })
      .then(({ token, cartId }) => {
        return checkoutEndpoint
          .placeOrder(
            token,
            cartId,
            email,
            shipment,
            paymentProvider,
            paymentMethod
          )
          .then((response) => {
            return response.body.data.attributes.orderReference
          })
      })
  }
)
