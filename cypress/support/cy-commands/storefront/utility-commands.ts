Cypress.Commands.add('closeAllFlashMessages', () => {
  cy.get('flash-message')
    .filter(':visible')
    .each(($flash) => {
      // check if the flash message is still connected to the dom (that it did not disappear on its own)
      if (Cypress.dom.isAttached($flash)) {
        cy.wrap($flash).click()
      }
    })
})
