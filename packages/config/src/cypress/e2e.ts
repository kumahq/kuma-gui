import 'cypress-fail-fast'
import failOnConsoleError from 'cypress-fail-on-console-error'
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector'

installLogsCollector({
  collectTypes: ['cons:warn', 'cons:debug'],
})
failOnConsoleError()
