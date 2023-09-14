import { When, Then, Before, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor'
import jsYaml, { DEFAULT_SCHEMA, Type } from 'js-yaml'

import { useServer, useMock, useClient } from '@/services/e2e'
import { undefinedSymbol } from '@/test-support'
import type { HistoryEntry } from '@/test-support'

const console = {
  log: (message: unknown) => Cypress.log({ displayName: 'LOG', message: JSON.stringify(message) }),
}
const YAML = {
  parse: (str: string) => {
    return jsYaml.load(str, {
      schema: DEFAULT_SCHEMA.extend([
        new Type('tag:yaml.org,2002:js/undefined', {
          kind: 'scalar',
          construct: () => {
            return undefinedSymbol
          },
        }),
      ]),
    })
  },
}

let env = {}
let selectors: Record<string, string> = {}
const client = useClient()
Before(() => {
  env = {}
  selectors = {}
  client.history = []
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
    ...YAML.parse(yaml) as object,
  }
  Object.entries(env).forEach(([key, value]) => {
    cy.setCookie(key, String(value))
  })
})
Given('the URL {string} responds with', (url: string, yaml: string) => {
  const mock = useMock()
  mock(url, env, (respond) => {
    const response = respond(
      (YAML.parse(yaml) || {}) as {
        headers?: Record<string, string>,
        body?: Record<string, unknown>
      },
    )
    return response
  })
})

// act
When('I wait for {int} milliseconds/ms', function (ms: number) {
  cy.wait(ms)
})

When(/^I click the "(.*)" element(?: and select "(.*)")?$/, (selector: string, value?: string) => {
  const event = 'click'
  if (value !== undefined) {
    $(selector).select(value)
  } else {
    $(selector)[event]({ force: true })
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

When('I clear the {string} element', (selector: string) => {
  $(selector).clear()
})

When('I go {string}', (direction: number | Cypress.HistoryDirection) => {
  cy.go(direction)
})

// assert
Then('the URL is {string}', (expected: string) => {
  const base = Cypress.env().KUMA_BASE_URL || 'http://localhost:5681/gui'
  cy.url().should('eq', `${base}${expected}`)
})
Then('the URL contains {string}', (str: string) => {
  cy.url().should('include', str)
})

Then(/^the URL "(.*)" was requested ([0-9]*) time[s]?$/, (url: string, count: string) => {
  const items = client.history.filter((item: HistoryEntry) => item.url.pathname === url)
  expect(items.length).to.be(count)
})

Then(/^the URL "(.*)" was?(n't | not | )requested with$/, (url: string, not: string = '', yaml: string) => {
  const bool = not.trim().length === 0
  const xhr = client.history.filter((item: HistoryEntry) => item.url.pathname === url)
  // If we are asserting the URL _wasn't_ called, and we don't find it, exit early
  if (xhr.length === 0 && !bool) {
    expect(xhr.length).to.equal(0, `${url} wasn't requested`)
    return
  }
  if (xhr.length > 0) {
    const data = YAML.parse(yaml) as {
      method: string,
      searchParams: Record<string, string>,
      body: Record<string, unknown>
    }
    const found = xhr.find((item: HistoryEntry) => {
      return Object.entries(data).every(
        ([key, value]) => {
          switch (key) {
            case 'method':
              return item.request[key] === String(value)
            case 'body':
              return Object.entries(data[key]).every(([prop, value]) => {
                return item.request[key][prop] === String(value)
              })
            case 'searchParams':
              return Object.entries(data[key]).every(([key, value]) => {
                const actual = item.url.searchParams.getAll(key)
                // convert input to an array
                const expected = Array.isArray(value) ? value : [value]
                return expected.every((item) => {
                  return actual.includes(String(item)) === true
                })
              })
          }
          return false
        },
      )
    })
    if (bool) {
      expect(found).to.not.equal(undefined, `${url} was requested with params...`)
    } else {
      expect(found).to.equal(undefined, `${url} wasn't requested with params...`)
    }
  } else {
    // If we are asserting the URL _was_ called, and we don't find it, fail
    expect(xhr.length).to.not.equal(0, `${url} was requested`)
  }
})

Then(/^the "(.*)" element[s]?( don't | doesn't | )exist[s]?$/, function (selector: string, assertion: string) {
  const prefix = assertion === ' ' ? '' : 'not.'
  const chainer = `${prefix}exist`

  $(selector).should(chainer)
})

Then(/^the "(.*)" element[s]? exist[s]? ([0-9]*) time[s]?$/, (selector: string, count: string) => {
  $(selector).should('have.length', count)
})

Then(/^the "(.*)" element[s]?( isn't | aren't | is | are )(.*)$/, (selector: string, assertion: string, booleanAttribute: string) => {
  const prefix = ['is', 'are'].includes(assertion.trim()) ? '' : 'not.'
  const chainer = `${prefix}be.${booleanAttribute}`

  $(selector).should(chainer)
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
  cy.title().should('contain', title)
})

// debug
Then('pause', function () {
  cy.pause()
})
Then(/^(everything is )?ok$/, function () {
  expect(true).to.equal(true)
})
Then('log {string}', function (message: string) {
  console.log(message)
})
