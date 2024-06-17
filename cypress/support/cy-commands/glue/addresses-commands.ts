import { AccessTokens } from '../../glue-endpoints/authentication/access-tokens'

const tokenEndpoint = new AccessTokens()

Cypress.Commands.add(
  'checkAndDeleteAllCustomerAddresses',
  (email: string, password: string, customerReference: string) => {
    let token: string

    tokenEndpoint
      .getCustomerAccessToken(email, password)
      .then((response) => {
        token = response.body.data.attributes.accessToken
        return token
      })
      .then((token) => {
        return cy
          .api({
            method: 'GET',
            url: `${Cypress.env('GLUE_URL')}/customers/${customerReference}/addresses`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
          })
          .then((response) => {
            /* eslint-disable */
            expect(response.isOkStatusCode).to.be.true
            /* eslint-enable */
            if (response.status === 200 && response.body.data.length > 0) {
              const addresses = response.body.data
              cy.log(
                `${addresses.length} addresses found. They will be deleted.`
              )

              let deleteCount = 0

              addresses.forEach((address) => {
                const addressUuid = address.id

                cy.api({
                  method: 'DELETE',
                  url: `${Cypress.env('GLUE_URL')}/customers/${customerReference}/addresses/${addressUuid}`,
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
                    if (deleteCount === addresses.length) {
                      cy.log(`${deleteCount} addresses were deleted.`)
                    }
                  })
              })
            } else {
              cy.log('No addresses found for the customer.')
            }
          })
      })
  }
)
