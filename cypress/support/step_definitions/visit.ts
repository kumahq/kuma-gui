import { When } from '@badeball/cypress-cucumber-preprocessor'

const config = {
  BASE_URL: Cypress.env('KUMA_BASE_URL') || 'http://localhost:5681/gui',
}

When('I visit the {string} URL', function (path: string) {
  cy.viewport(1366, 768)
  // turn off MSW in dev environments so we can use cy.intercept
  cy.setCookie('KUMA_MOCK_API_ENABLED', 'false')
  //
  cy.visit(`${config.BASE_URL}${path}`)
  // currently use this to denote "the page has initially rendered"
  cy.get('.app-main-content').should('be.visible')
  cy.wait(1000)
  cy.get('.empty-state-wrapper').should('not.exist')
})
When('I load the {string} URL', function (path: string) {
  cy.viewport(1366, 768)
  cy.visit(`${config.BASE_URL}${path}`)
})
