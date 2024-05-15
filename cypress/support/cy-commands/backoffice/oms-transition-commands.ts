Cypress.Commands.add('triggerOmsTransition', () => {
  // keep in mind that by default exec() command runs commands in the root Cypress tests directly
  // please provide the correct path to your Spryker env below
  cy.exec('console oms:check-condition')
    .its('stdout')
    .should('contain', 'Finished: SUCCESS')
  cy.exec('console oms:check-timeout')
    .its('stdout')
    .should('contain', 'Finished: SUCCESS')
})
