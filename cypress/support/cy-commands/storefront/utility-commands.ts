Cypress.Commands.add('closeAllFlashMessages', (): Cypress.Chainable => {
  return cy
    .get('flash-message')
    .filter(':visible')
    .each(($flash) => {
      // Check if the flash message is still connected to the DOM (that it did not disappear on its own)
      if (Cypress.dom.isAttached($flash)) {
        cy.wrap($flash).click()
      }
    })
})
