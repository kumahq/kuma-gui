import { When, Then, Before, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor'
import jsYaml, { DEFAULT_SCHEMA, Type } from 'js-yaml'

import { useServer, useMock, useClient } from '@/services/e2e'
import { undefinedSymbol } from '@/test-support'

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
  client.reset()
  env = {}
  selectors = {}
  useServer()
})

const negativeTimeout = parseInt(Cypress.env().KUMA_NEGATIVE_TIMEOUT) || 4000
const timeout = (negative: boolean) => negative ? { timeout: negativeTimeout } : {}

const $ = (...args: Parameters<typeof cy.get>) => {
  return cy.get(...resolveCustomAlias(...args))
}

function resolveCustomAlias(...args: Parameters<typeof cy.get>): Parameters<typeof cy.get> {
  let selector = args[0]
  if (selector.startsWith('$')) {
    const alias = selector.split(/[: .[#]/).shift()!.substring(1)
    if (typeof selectors[alias] === 'undefined') {
      throw new Error(`Could not find alias $${alias}. Make sure you have defined the alias in a CSS selectors step`)
    }
    selector = selector.replace(`$${alias}`, selectors[alias])
    return resolveCustomAlias(selector, args[1])
  }
  return args
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
        headers?: Record<string, string>
        body?: Record<string, unknown>
      },
    )
    return response
  })
})

// act

// TODO(jc): we can probably combine these 2 steps
When(/^I click the "(.*)" element(?: and select "(.*)")?$/, (selector: string, value?: string) => {
  const event = 'click'
  if (value !== undefined) {
    $(selector).select(value)
  } else {
    $(selector)[event]({ force: true })
  }
})

When(/^I (.*) on the "(.*)" element$/, (event: string, selector: string) => {
  switch (event) {
    case 'hover':
      event = 'mouseenter'
      break
  }
  $(selector).trigger(event, { force: true })
})
//

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

When('I navigate {string}', (direction: Cypress.HistoryDirection) => {
  cy.go(direction)
})

// assert

Then('the URL is {string}', (expected: string) => {
  const base = Cypress.config('baseUrl') || Cypress.env().KUMA_BASE_URL
  cy.url().should('eq', `${base}${expected}`)
})

Then(/^the URL( doesn't | )contain[s]? "(.*)"$/, (assertion: string, str: string) => {
  const negative = assertion !== ' '
  const prefix = negative ? 'not.' : ''
  cy.url().should(`${prefix}include`, str)
})

Then(/^the URL "(.*)" was?(n't | not | )requested with$/, (url: string, not: string = '', yaml: string) => {
  cy.wrap({
    url,
    ...YAML.parse(yaml) as {
      method: string
      searchParams: Record<string, string>
      body: Record<string, unknown>
    },
  }).then(async (request) => {
    const found = await client.waitForRequest(request)
    if (not.trim().length === 0) {
      expect(found).to.equal(true, `${url} was requested with ...`)
    } else {
      expect(found).to.equal(false, `${url} wasn't requested ...`)
    }
  })
})

Then(/^the "(.*)" element[s]? exist[s]? ([0-9]*) time[s]?$/, (selector: string, count: string) => {
  $(selector).should('have.length', count)
})

Then(/^the "(.*)" element[s]?( don't | doesn't | )exist[s]?$/, function (selector: string, assertion: string) {
  const negative = assertion !== ' '
  const prefix = negative ? 'not.' : ''

  $(selector, {
    ...timeout(negative),
  }).should(`${prefix}exist`)
})

Then(/^the "(.*)" element[s]?( isn't | aren't | is | are )(checked|disabled)$/, (selector: string, assertion: string, booleanAttribute: string) => {
  const negative = !['is', 'are'].includes(assertion.trim())
  const prefix = negative ? 'not.' : ''

  $(selector, {
    ...timeout(negative),
  }).should(`${prefix}be.${booleanAttribute}`)
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
  $(selector).then(($el) => {
    const chainer = $el[0].tagName === 'INPUT' ? 'have.value' : 'contain'
    cy.wrap($el).should(chainer, value)
  })
})

Then(/^the "(.*)" element is empty$/, (selector: string) => {
  $(selector).should('be.empty')
})

Then('the page title contains {string}', function (title: string) {
  cy.title().should('contain', title)
})

// debug
When('I wait for {int} milliseconds/ms', function (ms: number) {
  cy.wait(ms)
})
Then('pause', function () {
  cy.pause()
})
Then(/^(everything is )?ok$/, function () {
  expect(true).to.equal(true)
})
Then('log {string}', function (message: string) {
  console.log(message)
})
