import 'cypress-fail-fast'
import failOnConsoleError from 'cypress-fail-on-console-error'
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector'

// ignore ResizeObserver loop errors, they seem to be a common occurance with Cypress
Cypress.on('uncaught:exception', e => !e.message.includes('ResizeObserver loop limit exceeded'))

installLogsCollector({
  collectTypes: ['cons:warn', 'cons:debug'],
})
failOnConsoleError()

