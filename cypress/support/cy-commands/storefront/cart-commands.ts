import { CreateCartPage } from '../../page-objects/storefront/cart/create-cart-page'
const cart = new CreateCartPage()

//creates a new cart with name matching datetime of creation
Cypress.Commands.add('createNewCart', () => {
  const currentDateTime = new Date()
  cart.visit()
  cart.getCartNameField().type(currentDateTime.toISOString())
  cart.createCart()
})
