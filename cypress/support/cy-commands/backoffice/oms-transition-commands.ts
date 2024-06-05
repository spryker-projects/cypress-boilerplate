Cypress.Commands.add('triggerOmsTransition', (path = '') => {
  // keep in mind that by default exec() command runs commands in the root Cypress tests directly
  // please provide the correct path to your Spryker env
  // and change the validation logic, as default is set not fail on non-zero exit
  const baseCommand = path ? `cd ${path} && docker/sdk` : 'docker/sdk'
  cy.exec(`${baseCommand} console oms:check-condition`, { failOnNonZeroExit: false })
    .its('code')
    .should('not.eq', 0)
  cy.exec(`${baseCommand} console oms:check-timeout`, { failOnNonZeroExit: false })
    .its('code')
    .should('not.eq', 0)
})
