import 'cypress-fail-fast'
import failOnConsoleError from 'cypress-fail-on-console-error'
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector'

// ignore ResizeObserver loop errors, they seem to be a common occurrence with Cypress
Cypress.on('uncaught:exception', e => !e.message.includes('ResizeObserver loop'))

installLogsCollector({
  collectTypes: ['cons:warn', 'cons:debug'],
})
failOnConsoleError()

