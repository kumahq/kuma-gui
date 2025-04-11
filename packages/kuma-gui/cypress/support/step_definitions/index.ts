import { When, Then, Before, Given, DataTable, After } from '@badeball/cypress-cucumber-preprocessor'
import deepmerge from 'deepmerge'
import jsYaml, { DEFAULT_SCHEMA, Type } from 'js-yaml'

import { useMock, useClient } from '../../services'
import type { ArrayMergeOptions } from 'deepmerge'

// merges objects in array positions rather than replacing
const undefinedSymbol = Symbol('undefined')
const combineMerge = (target: object[], source: object[], options: ArrayMergeOptions): object[] => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

const merge = <T>(response: T, obj: Partial<T>): T => {
  const merged = deepmerge<T>(response, obj, { arrayMerge: combineMerge })
  return JSON.parse(JSON.stringify(merged, (_key, value) => {
    if (value === undefinedSymbol) {
      return
    }
    return value
  }))
}

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
let localStorage: Set<string>
const client = useClient()
const mock = useMock()
Before(() => {
  client.reset()
  env = {}
  selectors = {}
  localStorage = new Set()
  // mock everything with no specific env vars
  // record every request as a client.request
  mock('*', {}, (req, response) => {
    client.request({
      url: req.url,
      request: {
        method: req.method,
        body: req.body,
      },
    })
    return response
  })
})
After(() => {
  Array.from(localStorage).forEach((key) => {
    window.localStorage.removeItem(key)
  })
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

Given('the localStorage', (yaml: string) => {
  const obj = YAML.parse(yaml) as object
  Object.entries(obj).forEach(([key, value]) => {
    window.localStorage.setItem(key, JSON.stringify(value))
    localStorage.add(key)
  })
})

Given('the URL {string} responds with', (url: string, yaml: string) => {
  // mock is a call to cy.intercept
  // which mocks this specific url with the current env vars
  // records every request as a client.request
  // and merges any test case mock with the fake-fs mock
  mock(url, env, (req, response) => {
    // once the response has been rendered but not sent resolve any
    // waiting request assertions this means that any mocking done after
    // awaiting the request will happen on the subsequent request not this
    // one
    client.request({
      url: req.url,
      request: {
        method: req.method,
        body: req.body,
      },
    })
    // merge test mock in with fake-api mock
    return merge(response, YAML.parse(yaml) ?? {})
  })
})

Given('the date is {string}', (datetime: string) => {
  cy.clock(new Date(datetime).getTime(), ['Date'])
})

// act

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
          case 'KUMA_VERSION':
            config.version = item.value
            break
          case 'KUMA_MODE':
            config.mode = item.value
            break
          case 'KUMA_ENVIRONMENT':
            config.environment = item.value
            break
          case 'KUMA_STORE_TYPE':
            config.storeType = item.value
            break
        }
      })
      node.textContent = JSON.stringify(config)
    })
    // currently use this to denote "the page has initially rendered"
    cy.get('[data-testid-root="mesh-app"]').should('be.visible')
  })
})

When('I load the {string} URL', function (path: string) {
  cy.visit(`${path}`)
})

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

// whilst the response is sent after waitForRequest resolves the response itself
// has been rendered on the server therefore any mocking done after this step
// will apply to the following request
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
Then(/^the "(.*)" element( doesn't | )contain[s]? "(.*)"$/, (selector: string, assertion: string, value: string) => {
  $(selector).then(($el) => {
    const negative = assertion !== ' '
    const prefix = negative ? 'not.' : ''
    const chainer = $el[0].tagName === 'INPUT' ? 'have.value' : 'contain'
    $(selector).should(`${prefix}${chainer}`, value)
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
Then(/^screenshot the "(.*)" element to "(.*)"$/, function (selector: string, path: string) {
  const $cy = $(selector)
  $cy.then(($jQuery) => {
    const $el: HTMLElement | null = $jQuery.get(0)
    const rect = $el.getBoundingClientRect()
    const win = $el.ownerDocument.defaultView!
    $cy.screenshot(
      path,
      {
        capture: 'viewport',
        clip: {
          x: 0,
          y: 0,
          width: Math.min(rect.width, win.innerWidth),
          height: Math.min(rect.height, win.innerHeight),
        },
      })
  })
})
