import { When } from '@badeball/cypress-cucumber-preprocessor'

When('I visit the {string} URL', function (path: string) {
  // turn off MSW in dev environments so we can use cy.intercept
  cy.setCookie('KUMA_MOCK_API_ENABLED', 'false')
  //

  cy.getAllCookies().then((cookies) => {
    cy.visit(`${path}`)
    cy.get('#kuma-config').then((obj) => {
      const node = obj.get(0)
      if (node === null || node.textContent === null) {
        throw new Error('#kuma-config not found')
      }
      const config = JSON.parse(node.textContent)
      cookies.forEach(item => {
        switch (item.name) {
          case 'KUMA_MODE':
            config.mode = item.value
            break
          case 'KUMA_ENVIRONMENT':
            config.environment = item.value
            break
        }
      })
      node.textContent = JSON.stringify(config)
    })
  })
  // currently use this to denote "the page has initially rendered"
  cy.get('.app-main-content', { timeout: 10000 }).should('be.visible')
})
When('I load the {string} URL', function (path: string) {
  cy.visit(`${path}`)
})
