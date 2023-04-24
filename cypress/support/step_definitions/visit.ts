import { When } from '@badeball/cypress-cucumber-preprocessor'

const config = {
  BASE_URL: Cypress.env('KUMA_BASE_URL') || 'http://localhost:5681/gui',
}

When('I visit the {string} URL', function (path: string) {
  cy.viewport(1366, 768)
  cy.visit(`${config.BASE_URL}${path}`)
  cy.get('.app-main-content').should('be.visible')
  cy.wait(1000)
  cy.get('.empty-state-wrapper').should('not.exist')
})
