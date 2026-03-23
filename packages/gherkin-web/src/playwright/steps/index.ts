import { createFetch } from '@kumahq/fake-api'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import { getClient, YAML, merge, Cookie, routeToRegexp } from '../..'
import type { DataTable } from '@cucumber/cucumber'

type Options = {
  baseURL?: string
  negativeTimeout?: number
  dependencies: any
  fs: any
  client?: ReturnType<typeof getClient>
}
export async function setupSteps({ dependencies, fs, baseURL = '', negativeTimeout = 4000, client = getClient() }: Options) {
  const _fetch = createFetch({
    dependencies,
    fs,
  })
  const config = {
    baseURL,
    negativeTimeout,
    fetch: async (...rest: Parameters<typeof _fetch>) => {
      const options = rest[1] ?? {}
      const cookie = options?.headers?.cookie ?? ''
      const cookies = Cookie.parse(Array.isArray(cookie) ? cookie.join('') : cookie)

      const res = _fetch(...rest)

      if (cookies.KUMA_LATENCY) {
        await new Promise((resolve) => setTimeout(resolve, parseInt(cookies.KUMA_LATENCY)))
      }
      return res
    },
  }

  const { Given, When, Then, Before, After } = createBdd()

  const fetch = config.fetch

  const timeout = (negative: boolean) => negative ? { timeout: config.negativeTimeout } : {}

  const resolveAlias = (...args: string[]): string[] => {
    let selector = args[0]
    if (selector.startsWith('$')) {
      const alias = selector.split(/[: .[#]/).shift()!.substring(1)
      if (typeof selectors[alias] === 'undefined') {
        throw new Error(`Could not find alias $${alias}. Make sure you have defined the alias in a CSS selectors step`)
      }
      selector = selector.replace(`$${alias}`, selectors[alias])
      return resolveAlias(selector, args[1])
    }
    return args
  }

  const $ = (...args: string[]) => {
    return resolveAlias(...args).join(' ')
  }

  let env: Record<string, string> = {}
  let selectors: Record<string, string> = {}
  let localStorage: Set<string>
  Before(async ({ context }) => {
    client.reset()
    env = {}
    selectors = {}
    localStorage = new Set()
    await context.unrouteAll()
    await context.addCookies([
      {
        name: 'KUMA_MOCK_API_ENABLED',
        value: 'false',
        url: `${config.baseURL}`,
      },
    ])
    const p = Object.keys(fs).map(route => {
      return context.route(
        (u) => routeToRegexp(route).test(u.toString()),
        async (route, request) => {
          try {
            const url = request.url()
            const cookies = await context.cookies()
            const envs = Object.entries(env).map(([name, value]) => ( {name, value} ))
            const response = await fetch(url, {
              method: request.method(),
              headers: {
                cookie: [...cookies, ...envs].map((c) => `${c.name}=${c.value}`).join('; '),
                ...request.headers(),
              },
            })
            client.request({
              url: new URL(url),
              request: {
                method: request.method(),
                body: request.postDataJSON() ?? {},
              },
            })
            const type = response.headers.get('Content-Type') ?? 'application/json'
            const body = type.endsWith('/json') ? JSON.stringify((await response.json()), null, 4) : (await response.text())
            await route.fulfill({
              status: parseInt(response.headers.get('Status-Code') ?? '200'),
              contentType: type,
              body,
            })
          } catch (e) {
            console.error(e)
            await route.continue()
          }
        })

    })
    await Promise.all(p)

  })
  After(async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
  })

  // arrange
  Given('the CSS selectors', ({ page: _page }, table: DataTable) => {
    table.hashes().forEach(
      (item) => {
        selectors[item.Alias] = item.Selector
      },
    )
  })
  Given('the environment', async ({ context }, yaml: string) => {
    env = {
      ...env,
      ...YAML.parse(yaml) as object,
    }
    await context.addCookies(Object.entries(env).map(([key, value]) => ({
      name: key,
      value: String(value),
      url: `${config.baseURL}`,
    })))
  })

  Given('the localStorage', async ({ context }, yaml: string) => {
    const obj = YAML.parse(yaml) as object
    await context.addInitScript((data: any) => {
      Object.entries(data).forEach(([key, value]) => {
        window.localStorage.setItem(key, JSON.stringify(value))
      })
    }, obj)
    Object.entries(obj).forEach(([key]) => {
      localStorage.add(key)
    })
  })

  Given('the URL {string} responds with', async ({ context }, route: string, yaml: string) => {
    await context.route(
      (u) => routeToRegexp(route).test(u.pathname),
      async (route, request) => {
        try {
          const url = request.url()
          const cookies = await context.cookies()
          const envs = Object.entries(env).map(([name, value]) => ( {name, value} ))
          const response = await fetch(url, {
            method: request.method(),
            headers: {
              cookie: [...cookies, ...envs].map((c) => `${c.name}=${c.value}`).join('; '),
              ...request.headers(),
            },
          })
          client.request({
            url: new URL(url),
            request: {
              method: request.method(),
              body: request.postDataJSON() ?? {},
            },
          })
          const type = response.headers.get('Content-Type') ?? 'application/json'

          const _yaml = (YAML.parse(yaml) ?? {}) as {
            headers?: Record<string, string>
            body?: Record<string, unknown> | string
          }
          let merged
          // we are using content-type to understand the shape of body
          // /json means Record<string, unknown>
          // otherwise we assume body is a string so we use `as` below
          if (type.endsWith('/json')) {
            merged = merge({ body: await response.json(), headers: Object.fromEntries(response.headers.entries()) }, _yaml) as any
            await route.fulfill({
              contentType: type,
              status: parseInt(merged.headers?.['Status-Code'] ?? response.headers.get('Status-Code') ?? '200'),
              body: JSON.stringify(merged.body),
            })
          } else {
            merged = _yaml
            await route.fulfill({
              contentType: type,
              status: parseInt(merged.headers?.['Status-Code'] ?? response.headers.get('Status-Code') ?? '200'),
              body: merged.body as string,
            })
          }
          //
          return
        } catch (e) {
          console.error(e)
        }
        await route.continue()
      })
  })

  Given('the date is {string}', async ({ page }, datetime: string) => {
    await page.clock.install({ time: new Date(datetime) })
  })

  // act

  When('I visit the {string} URL', async ({ page }, path: string) => {
    const url = `${config.baseURL}${path}`
    await page.goto(url)
    await page.locator('[data-testid-root="mesh-app"]').waitFor({
      state: 'attached',
    })
  })

  // TODO(jc): we can probably combine these 2 steps
  When(/^I click the "(.*)" element(?: and select "(.*)")?$/, async ({ page }, selector: string, _value?: string) => {
    const $elem = page.locator($(selector))
    switch ('click') {
      case 'click':
        await $elem.dispatchEvent('click')
        break
    }
  })

  When(/^I (.*) on the "(.*)" element$/, async ({ page }, event: string, selector: string) => {
    const $elem = page.locator($(selector))
    switch (event) {
      case 'hover':
        await $elem.hover({ force: true })
        break
      case 'click':
        await $elem.dispatchEvent('click')
        break
    }
  })
  //

  When('I {string} {string} into the {string} element', async ({ page }, event: string, text: string, selector: string) => {
    const $elem = page.locator($(selector))
    switch (event) {
      case 'input':
      case 'type':
        // TODO: make a "I press/hit enter" or similar step
        if (text === '{enter}') {
          await $elem.press('Enter')
        } else {
          await $elem.pressSequentially(text, { delay: 50 })
        }
        break
    }
  })

  When('I clear the {string} element', async ({ page }, selector: string) => {
    await page.locator($(selector)).clear()
  })

  When('I navigate {string}', async ({ page }, direction: 'back' | 'forward' | 'forwards') => {
    switch (direction) {
      case 'back':
        await page.goBack()
        break
      default:
        await page.goForward()
        break
    }
  })

  // assert

  Then('the URL is {string}', async ({ page }, expected: string) => {
    await page.waitForURL(`${config.baseURL}${expected}`)
  })

  Then(/^the URL( doesn't | )contain[s]? "(.*)"$/, async ({ page }, assertion: string, str: string) => {
    const negative = assertion !== ' '
    await page.waitForURL((url) => {
      const path = `${url.pathname}${url.search}`
      return !negative ? path.includes(str) : !path.includes(str)
    })
  })

  // whilst the response is sent after waitForRequest resolves the response itself
  // has been rendered on the server therefore any mocking done after this step
  // will apply to the following request
  Then(/^the URL "(.*)" was?(n't | not | )requested with$/, async ({ page: _page }, url: string, not: string = '', yaml: string) => {
    const found = await client.waitForRequest({
      url,
      ...YAML.parse(yaml) as {
        method: string
        searchParams: Record<string, string>
        body: Record<string, unknown>
      },
    })
    if (not.trim().length === 0) {
      expect(found).toEqual(true)
    } else {
      expect(found).toEqual(false)
    }
  })

  Then(/^the "(.*)" element[s]? exist[s]? ([0-9]*) time[s]?$/, async ({ page }, selector: string, count: string) => {
    const $items = page.locator($(selector))
    await expect($items).toHaveCount(parseInt(count))
  })

  Then(/^the "(.*)" element[s]? exist[s]?$/, async ({ page }, selector: string) => {
    await expect(page.locator($(selector))).toBeAttached()
  })

  Then(/^the "(.*)" element[s]? exist[s]? but the "(.*)" (elements don't exist|element doesn't exist)$/, async ({ page }, exists: string, notexists: string, assertion: string) => {
    const options = {
      timeout: config.negativeTimeout,
    }
    const $exists = page.locator($(exists))
    const $notexists = page.locator($(notexists))
    await expect($exists).toBeAttached()
    await expect($notexists).toHaveCount(0, options)
  })

  Then(/^the "(.*)" element[s]?( isn't | aren't | is | are )(checked|disabled)$/, async ({ page }, selector: string, assertion: string, booleanAttribute: string) => {
    const negative = !['is', 'are'].includes(assertion.trim())
    const options = {
      ...timeout(negative),
    }
    const $el = page.locator($(selector))
    let ex = expect($el)
    if (negative) {
      ex = ex.not
    }
    switch (booleanAttribute) {
      case 'checked':
        await ex.toBeChecked(options)
        break
      case 'disabled':
        await ex.toBeDisabled(options)
        break
    }
  })

  Then(/^the "(.*)" element(s)? contain[s]?$/, async ({ page }, selector: string, multiple = '', table: DataTable) => {
    const rows = table.rows()
    if (multiple === 's') {
      let i = 0
      for (const $el of await page.locator($(selector)).all()) {
        const item = rows[i]
        if (item) {
          await expect($el).toContainText(rows[i])
        }
        i ++
      }
    } else {
      const $el = page.locator($(selector))
      await Promise.all(rows.map((item) => expect($el).toContainText(item)))
    }
  })

  Then(/^the "(.*)" element( doesn't | )contain[s]? "(.*)"$/, async ({ page }, selector: string, assertion: string, value: string) => {
    const negative = assertion !== ' '
    const $elem = page.locator($(selector))
    const type = await $elem.evaluate(node => node.tagName)
    let ex = expect($elem)
    if (negative) {
      ex = ex.not
    }
    if (type.toLowerCase() === 'input') {
      await ex.toHaveValue(value)
    } else {
      await ex.toContainText(value)
    }
  })

  Then(/^the "(.*)" element is empty$/, async ({ page }, selector: string) => {
    await expect(page.locator($(selector))).toBeEmpty()
  })

  Then('the page title contains {string}', async ({ page }, title: string) => {
    await expect(page).toHaveTitle(new RegExp(title))
  })

  // debug
  When('I wait for {int} milliseconds/ms', async ({ page }, ms: number) => {
    await page.waitForTimeout(ms)
  })
  Then('pause', async ({ page }) => {
    await page.pause()
  })
  Then(/^(everything is )?ok$/, async () => {
    expect(true).toBe(true)
  })
  Then('log {string}', async ({ page: _page }, message: string) => {
    // eslint-disable-next-line no-console
    console.log(message)
  })
}
