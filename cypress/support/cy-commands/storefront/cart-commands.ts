import { StorefrontCreateCartPage } from '../../page-objects/storefront/cart/storefront-create-cart-page'
const cart = new StorefrontCreateCartPage()

//creates a new cart with name matching datetime of creation
Cypress.Commands.add('createNewCart', () => {
  const currentDateTime = new Date()
  cart.visit()
  cart.getCartNameField().type(currentDateTime.toISOString())
  cart.createCart()
})
