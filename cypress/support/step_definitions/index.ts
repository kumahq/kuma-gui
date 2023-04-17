import { When, Then, Before, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor'
import YAML from 'js-yaml'

import { useServer, useMock, TOKENS, services as e2e } from '../services'
import { build } from '@/services/utils'
(async () => {
  build(
    e2e(TOKENS),
  )
})()

const console = {
  log: (message: unknown) => Cypress.log({ displayName: 'LOG', message: JSON.stringify(message) }),
}
let env = {}
let selectors: Record<string, string> = {}
Before(() => {
  env = {}
  selectors = {}
  useServer()
})
type Cy = typeof cy;
const $ = (selector: string): ReturnType<Cy['get']> => {
  if (selector.startsWith('$')) {
    const alias = selector.split(/[: .[#]/).shift()!.substring(1)
    selector = selector.replace(`$${alias}`, selectors[alias])
    return $(selector)
  }
  // @ts-ignore
  return cy.get(selector)
}

// arrange
Given('the CSS selectors', (table: DataTable) => {
  table.hashes().forEach(
    (item) => {
      selectors[item.Alias] = item.Selector
    },
  )
})
Given('the environment', (yaml: string) => {
  env = {
    env,
    ...YAML.load(yaml) as object,
  }
})
Given('the URL {string} responds with', (url: string, yaml: string) => {
  const mock = useMock()
  mock(url, env, (respond) => {
    return respond(YAML.load(yaml) as { headers?: Record<string, string>, body?: Record<string, unknown> })
  })
})

// act
When(/^I "(.*)" on the "(.*)" element$/, async (event: string, selector: string) => {
  $(selector).trigger(event)
})

// assert
Then('the URL contains {string}', (str: string) => {
  cy.url().should('include', str)
})

Then(/^the "(.*)" element( does| doesn't| don't)? exist[s]?$/, function (selector: string, assertion: string) {
  $(selector).should(`${(assertion || 'does').trim() !== 'does' ? 'not.' : ''}exist`)
})
Then(/^the "(.*)" element[s]? exist[s]? ([0-9]*) time[s]?$/, async (selector: string, count: string) => {
  $(selector).should('have.length', count)
})
Then(/^the "(.*)" element(s)? contain[s]?$/, async (selector: string, multiple = '', table: DataTable) => {
  const rows = table.rows()
  if (multiple === 's') {
    $(selector).each((el, i) => {
      const item = rows[i]
      if (item) {
        cy.wrap(el).contains(item[0])
      }
    })
  } else {
    rows.forEach((item) => {
      $(selector).contains(item[0])
    })
  }
})
Then(/^the "(.*)" element contains "(.*)"$/, async (selector: string, value: string) => {
  $(selector).contains(value)
})

Then('the page title contains {string}', function (title: string) {
  cy.wait(1000)
  $('head title').contains(title)
})

// debug
Then('pause', function () {
  cy.pause()
})
Then('log {string}', function (message: string) {
  console.log(message)
})
