import { When, Then, Before, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor'
import YAML from 'js-yaml'

import { useServer, useMock } from '@/services/e2e'

const console = {
  log: (message: unknown) => Cypress.log({ displayName: 'LOG', message: JSON.stringify(message) }),
}
let env = {}
let selectors: Record<string, string> = {}
let urls = new Map()
Before(() => {
  env = {}
  selectors = {}
  urls = new Map()
  useServer()
})

const $ = (selector: string) => {
  const resolvedSelector = resolveCustomAlias(selector)

  return cy.get(resolvedSelector)
}

function resolveCustomAlias(selector: string): string {
  if (selector.startsWith('$')) {
    const alias = selector.split(/[: .[#]/).shift()!.substring(1)

    if (typeof selectors[alias] === 'undefined') {
      throw new Error(`Could not find alias $${alias}. Make sure you have defined the alias in a CSS selectors step`)
    }

    selector = selector.replace(`$${alias}`, selectors[alias])

    return resolveCustomAlias(selector)
  }

  return selector
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
    ...env,
    ...YAML.load(yaml) as object,
  }
})
Given('the URL {string} responds with', (url: string, yaml: string) => {
  const now = new Date().getTime()
  const mock = useMock()
  urls.set(url, `spy-${now}`)
  mock(url, env, (respond) => {
    const response = respond((YAML.load(yaml) || {}) as { headers?: Record<string, string>, body?: Record<string, unknown> })
    return response
  }).as(urls.get(url))
})

// act
When('I wait for {int} milliseconds/ms', function (ms: number) {
  cy.wait(ms)
})

When(/^I "(.*)"(.*)? on the "(.*)" element$/, (event: string, object: string | number | undefined, selector: string) => {
  switch (event) {
    case 'select':
      if (typeof object === 'undefined') {
        throw new Error()
      }
      $(selector).select(parseInt(object.toString()), { force: true })
      break
    default:
      $(selector).trigger(event, { force: true })
  }
})

When('I {string} {string} into the {string} element', (event: string, text: string, selector: string) => {
  switch (event) {
    case 'input':
    case 'type':
      $(selector).type(text)
      break
  }
})

// assert
Then('the URL contains {string}', (str: string) => {
  cy.url().should('include', str)
})

Then('the URL {string} was requested with', (url: string, yaml: string) => {
  cy.wait(`@${urls.get(url)}`).then((xhr) => {
    const data = YAML.load(yaml) as {method: string, searchParams: Record<string, string>, body: Record<string, unknown>}
    Object.entries(data).forEach(
      ([key, value]) => {
        switch (key) {
          case 'method':
            expect(xhr.request[key]).to.equal(value)
            break
          case 'body':
            Object.entries(data[key]).forEach(([prop, value]) => {
              expect(xhr.request[key][prop]).to.equal(value)
            })
            break
          case 'searchParams':
            Object.entries(data[key]).forEach(([key, value]) => {
              expect(xhr.request.query[key]).to.equal(value)
            })
            break
        }
      },
    )
  })
})

Then(/^the "(.*)" element( does| doesn't| don't)? exist[s]?$/, function (selector: string, assertion: string) {
  $(selector).should(`${(assertion || 'does').trim() !== 'does' ? 'not.' : ''}exist`)
})
Then(/^the "(.*)" element[s]? exist[s]? ([0-9]*) time[s]?$/, (selector: string, count: string) => {
  $(selector).should('have.length', count)
})
Then(/^the "(.*)" element(s)? contain[s]?$/, (selector: string, multiple = '', table: DataTable) => {
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
Then(/^the "(.*)" element contains "(.*)"$/, (selector: string, value: string) => {
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
