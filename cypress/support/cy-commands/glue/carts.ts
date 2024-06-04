import { AccessToken } from '../../glue-endpoints/authentication/access-token'
import { Carts } from '../../glue-endpoints/cart/carts'

const tokenEndpoint = new AccessToken()
const cartEndpoint = new Carts()

Cypress.Commands.add(
  'deleteAllShoppingCarts',
  (email: string, password: string) => {
    let token: string

    tokenEndpoint
      .getCustomerAccessToken(email, password)
      .then((response) => {
        token = response.body.data.attributes.accessToken
        return token
      })
      .then((token) => {
        // Step 1: Create a new shopping cart
        return cartEndpoint.createGrossCart(token).then((createResponse) => {
          expect(createResponse.status).to.eq(201)
          const newCartId = createResponse.body.data.id
          cy.log(`New shopping cart created with ID: ${newCartId}`)

          // Step 2: Get the list of all shopping carts
          cy.api({
            method: 'GET',
            url: `${Cypress.env('GLUE_URL')}/carts`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
          }).then((getCartsResponse) => {
            expect(getCartsResponse.status).to.eq(200)
            const carts = getCartsResponse.body.data
            cy.log(`${carts.length} carts found.`)

            // Step 3: Delete all carts except the newly created one
            let deleteCount = 0

            carts.forEach((cart) => {
              if (cart.id !== newCartId) {
                cy.api({
                  method: 'DELETE',
                  url: `${Cypress.env('GLUE_URL')}/carts/${cart.id}`,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  failOnStatusCode: false,
                })
                  .then((deleteResponse) => {
                    if (deleteResponse.status === 204) {
                      deleteCount++
                    }
                    expect(deleteResponse.status).to.eq(204)
                  })
                  .then(() => {
                    if (deleteCount === carts.length - 1) {
                      cy.log(`${deleteCount} old carts were deleted.`)
                    }
                  })
              }
            })
          })
        })
      })
  }
)
