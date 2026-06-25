---
name: gherkin-playwright
description: "Write Gherkin/Cucumber `.feature` files that run as Playwright end-to-end tests for any web app using the steps shipped by `@kumahq/gherkin-web/playwright`. Use whenever the user asks to write or extend an e2e test, add a feature file, test a user flow, verify a UI state, assert an outgoing API request, or cover an edge/empty state — even if they don't say the words 'Gherkin' or 'Playwright'."
metadata:
  author: Kong
  version: 1.0
---

You are writing Gherkin `.feature` files for a web application that consumes the step library at `@kumahq/gherkin-web/playwright` (source: `packages/gherkin-web/src/playwright/steps/index.ts`). The features run via **playwright-bdd**.

The step library itself is project-agnostic: the same set of steps works in any consuming app. What differs per project is the surrounding wiring — where features live, which mock package the runtime is bound to, and which environment-variable keys are recognised. The skill explains how to discover those project details when you don't already know them.

## Hard constraints

- Touch only `.feature` files. Never modify application source, mock generators, step definitions, or existing fixtures.
- Use only the steps listed in this document. If you need behaviour that isn't here, stop and report the missing step — do **not** invent a step or import a new step library. Combining existing steps or adding partial mocks almost always covers the gap.
- Don't write tests that assert against the testing framework itself (`pause`, `ok`, `log` exist for debugging only — never ship them in a scenario).
- Don't modify existing mocks or fixtures. If the default response is wrong for your scenario, override only the fields you need via `the URL X responds with` — the partial body is deep-merged into the existing mock, so omit everything you don't care about.
- Keep scenarios independent: each must pass on its own, in any order. `Before` hooks reset routes, cookies, and `localStorage` between scenarios — don't rely on state bleeding across.
- If you need a new mock endpoint (the route is unmocked) or a new step, don't try to add it from here. Report it instead — those changes live in the project's mock package or step library, respectively.

## Locate the project's conventions

Three project-specific things determine how your feature file will look. Check each one before writing:

1. **Where feature files live.** The convention is a top-level `features/` directory in the package under test (e.g. `packages/<app>/features/`). Look there first.
   - If `features/` exists and contains `.feature` files, those are your siblings — read the closest one in full and use it as your template.
   - If `features/` exists but is empty, or doesn't exist where you expect, **ask the user** where existing feature files live before writing anything. The user may keep them under a different name (`e2e/`, `tests/features/`, etc.) or point you at another package.
   - If the user confirms there are **no** existing feature files in the project, fall through to the "Greenfield starter template" section below — the rest of this document is sufficient on its own.

2. **Which mock layer the runtime is bound to.** `@kumahq/gherkin-web/playwright` doesn't ship mocks; the consuming project wires its own mock package into `setupSteps({ dependencies, fs })`. The mock package will have to satisfy the following constraints:
   - Serves mocks per each requested URL.
   - A typed list of environment-variable keys (e.g. `Env.ts`) that the generators read.
   - In kuma-gui this is `@kumahq/kuma-http-api/mocks`; in other apps it will be different. Locate the project's equivalent before you start so you can check whether routes are mocked and which env keys exist.

3. **The `data-testid` (or equivalent) attributes the app exposes.** Selectors should reference attributes the app already declares. Grep the application source — typically `src/` under the same package as `features/` — for `data-testid=` to inventory what's available. Prefer `data-testid` over class names, `nth-child` chains, or text matchers. **Never invent new test IDs** — adding them would require modifying app source, which the constraints forbid.

## The step vocabulary

Every step below is defined in `packages/gherkin-web/src/playwright/steps/index.ts`. This is the **complete** set — no other steps exist.

### Arrange — `Given`

| Step | Purpose |
|---|---|
| `Given the CSS selectors` + DataTable `\| Alias \| Selector \|` | Register `$alias` shortcuts used everywhere else. |
| `Given the environment` + YAML doc string | Set env vars / cookies that the project's mock generator reads. The exact keys are project-specific — check the project's typed env list (e.g. an `Env.ts` in the mock package). |
| `Given the localStorage` + YAML doc string | Seed `localStorage` before the page loads. |
| `Given the URL "<route>" responds with` + YAML doc string | Override the mock response for a specific route. The YAML may have `headers` and/or `body`; partial keys are deep-merged into the default mock. |
| `Given the date is "<ISO date>"` | Freeze `Date.now()` via `page.clock.install`. |

### Act — `When`

| Step | Purpose |
|---|---|
| `When I visit the "<path>" URL` | Navigate to `${baseURL}${path}` and wait for the app root to attach. |
| `When I click the "<selector>" element` | Dispatch a click. |
| `When I click the "<selector>" element and select "<value>"` | Click + select (e.g. dropdown). |
| `When I hover on the "<selector>" element` | Force-hover. |
| `When I "<type\|input>" "<text>" into the "<selector>" element` | Type into an input. `"{enter}"` presses Enter. |
| `When I clear the "<selector>" element` | Empty an input. |
| `When I navigate "<back\|forward\|forwards>"` | Browser history navigation. |

### Assert — `Then`

| Step | Purpose |
|---|---|
| `Then the URL is "<path>"` | Wait for an exact URL match. |
| `Then the URL contains "<substring>"` / `Then the URL doesn't contain "<substring>"` | Substring match against `pathname + search`. |
| `Then the URL "<route>" was requested with` + YAML doc string | Wait for an outgoing request and assert `method` / `searchParams` / `body`. Use `wasn't requested with` for the negative form. |
| `Then the "<selector>" element exists` | Element is attached. |
| `Then the "<selector>" elements exist <N> times` | Exact count. |
| `Then the "<existing>" element exists but the "<missing>" element doesn't exist` | One present, one absent (uses the configured negative timeout). |
| `Then the "<selector>" element is/isn't checked` / `is/isn't disabled` | Boolean attribute checks. |
| `Then the "<selector>" element contains` + DataTable `\| Value \|` | Element contains every row's text (or, for `elements`, the Nth row in the Nth element). |
| `Then the "<selector>" element contains "<text>"` / `doesn't contain "<text>"` | Substring (`textContent` for elements, `value` for inputs). |
| `Then the "<selector>" element is empty` | No content. |
| `Then the page title contains "<text>"` | Regex match against `<title>`. |

### Debug-only (do not ship)

`When I wait for <N> ms`, `Then pause`, `Then ok` / `Then everything is ok`, `Then log "<message>"`. Useful while iterating; remove before submitting.

## The `$alias` selector system

Every selector argument supports a `$<alias>` prefix that gets expanded into the CSS string registered in `Given the CSS selectors`. Aliases compose with normal CSS:

```gherkin
Background:
  Given the CSS selectors
    | Alias   | Selector                           |
    | items   | [data-testid='item-collection']    |
    | item    | $items tbody tr                    |
    | summary | [data-testid='slideout-container'] |
```

Then `$item:nth-child(1)` resolves to `[data-testid='item-collection'] tbody tr:nth-child(1)`, and `$summary [data-testid='content-block']` works exactly like you'd expect — the resolver re-runs until no `$` prefixes remain.

**Always alias selectors that appear more than once.** Inline `[data-testid='...']` strings are reserved for one-off uses inside a single scenario.

## Mocks, env overrides, and partial fixtures

The Playwright runtime intercepts every request the app makes. By default each route is served by the project's mock package, which typically returns randomised data. Two levers control what comes back:

1. **`Given the environment`** sets cookies that the generators read. Use this for counts, modes, feature flags, and any other knob the mocks expose. The exact set of keys is project-specific — find the project's typed env list (e.g. an `Env.ts` in its mock package) and only use keys defined there. Setting an unknown key has no effect.

2. **`Given the URL "<route>" responds with`** lets a single scenario override fields on a specific response. The YAML body is **deep-merged** into the generated response, so write only the keys you care about:

   ```gherkin
   And the URL "/<resource>" responds with
     """
     body:
       items:
         - name: example-1
     """
   ```

   The rest of each item (timestamps, labels, nested fields) is filled in by the generator. Fixtures for list endpoints are special because you need to control the amount of items being returned. If the assertion only needs or can only work with a specific amount of items, supply a fixture for the required items and pair it with the relevant count env var set to that number if the default count would otherwise add randomised siblings.

3. **`headers`** can be set the same way to drive non-200 statuses:

   ```gherkin
   Given the URL "/<resource>" responds with
     """
     headers:
       Status-Code: "404"
     """
   ```

If a route is unmocked entirely (no generator in the project's mock package), the mock layer will throw. Don't paper over this from a feature file — flag it so the project's mock package can add the endpoint.

## Patterns

### Background

Put everything that's identical across scenarios in `Background` — typically the selector aliases plus any default environment / responses. Don't put anything scenario-specific there.

### Scenario Outline + Examples

Use when you have **at least two** parameterised variants of the same flow. The header row is the parameter names; angle-bracket references in the scenario body get substituted per Example row:

```gherkin
Scenario Outline: The navigation shows <Element> for <Mode>
  Given the environment
    """
    APP_MODE: <Mode>
    """
  When I visit the "/" URL
  Then the "<Element>" element exists

  Examples:
    | Element       | Mode  |
    | $admin-nav    | admin |
    | $standard-nav | user  |
```

For a single case, use a plain `Scenario`.

### Rule

Use `Rule:` to group related scenarios that share a business rule, when there are at least two of them and grouping clarifies the file.

### Asserting outgoing requests

`Then the URL "<route>" was requested with` is the canonical way to assert "the UI fired the right API call". Useful for filter inputs, pagination, and form submissions:

```gherkin
And I "type" "foo" into the "$input-search" element
And I "type" "{enter}" into the "$input-search" element
Then the URL "/<resource>" was requested with
  """
  searchParams:
    name: foo
    offset: 0
    size: 50
  """
```

## Greenfield starter template

Use this skeleton when the user has confirmed there are no existing feature files to copy from. Every line is real syntax — the only edits required are the bracketed `<…>` values.

```gherkin
Feature: <area> / <name>

  Background:
    Given the CSS selectors
      | Alias    | Selector                           |
      | listing  | [data-testid='<listing-tid>']      |
      | item     | $listing tbody tr                  |
      | overview | [data-testid='<single-item-page>'] |
    And the environment
      """
      <COUNT_ENV_KEY>: 1
      """
    And the URL "<list-route>" responds with
      """
      body:
        items:
          - name: <example-name>
      """
    And the URL "<single-item-route>" responds with
      """
      body:
        name <example-name>
      """

  Scenario: The page lists the seeded item
    When I visit the "<page-path>" URL
    Then the "$listing" element exists
    And the "$item" element exists 1 time
    And the "$item:nth-child(1)" element contains "<example-name>"

  Scenario: The page shows expected content
    When I visit the "<single-item-page-path> URL
    Then the "$overview" element exists
    And the "$overview" element contains "<example-name>"

  Scenario: The empty state is shown when there are no items
    Given the environment
      """
      <COUNT_ENV_KEY>: 0
      """
    And the URL "<list-route>" responds with
      """
      body:
        items: []
      """
    When I visit the "<page-path>" URL
    Then the "$listing" element doesn't contain "<example-name>"

  Scenario: The page handles a server error
    Given the URL "<list-route>" responds with
      """
      headers:
        Status-Code: "500"
      """
    When I visit the "<page-path>" URL
    Then the "$listing" element exists but the "$item" element doesn't exist
```

Replacements:

- `<area> / <name>` — e.g. `users / profile`. Lowercase, slash-separated.
- `<listing-tid>` — the `data-testid` value the page's main list/container uses (grep the project's app source for `data-testid=`).
- `<list-route>` — the API path the page fetches (no origin), e.g. `/users`.
- `<COUNT_ENV_KEY>` — only keep if a matching key exists in the project's mock env list. If none applies, drop the `Given the environment` block.
- `<example-name>` — any short string; the project's default generator fills in the other fields.
- `<page-path>` — the application URL, e.g. `/users`.

Then add scenarios specific to your page (interactions, filters, summary views, etc.) using the step vocabulary above.

## Real example (kuma-gui)

This is what a finished feature looks like in one project that uses this skill. Treat it as illustrative — the selectors, routes, env keys, and `kri` shape are kuma-gui specifics, not general conventions.

```gherkin
Feature: mesh / mesh-trust

  Background:
    Given the CSS selectors
      | Alias              | Selector                                |
      | meshtrusts-listing | [data-testid="mesh-trusts-listing"]     |
      | item               | $meshtrusts-listing tbody tr            |
      | summary            | [data-testid="slideout-container"]      |
      | summary-title      | $summary [data-testid='slideout-title'] |
    And the URL "/meshes/default/meshtrusts" responds with
      """
      body:
        items:
          - name: trust-1
            mesh: default
            kri: kri_mtrust_default___trust-1_
            labels:
              kuma.io/display-name: trust-1
              kuma.io/zone: zone-1
            spec:
              trustDomain: default.zone-1.mesh.local
      """

  Scenario: MeshTrusts are listed in mesh overview
    When I visit the "/meshes/default" URL
    Then the "$meshtrusts-listing" element exists
    And the "$item:nth-child(1)" element contains
      | Value                     |
      | trust-1                   |
      | zone-1                    |
      | default.zone-1.mesh.local |

  Scenario: Clicking a mesh trust opens the summary slideout
    When I visit the "/meshes/default" URL
    Then I click the "$item:nth-child(1) td:first-child a" element
    Then the URL contains "/meshes/default/overview/meshtrust/kri_mtrust_default___trust-1_"
    And the "$summary" element exists
    And the "$summary-title" element contains "trust-1"
```

## Quality bar

- Cover the happy path **and** at least one edge / empty / error state (use `Status-Code: "404"`, a count env var set to `0`, etc).
- Prefer one assertion per `Then` line — splitting `And` lines reads better than packing many checks into a single step.
- Use the app's existing `data-testid` attributes. Don't reach for class names, `nth-child` chains, or text matchers unless that's all the DOM offers.
- Scenario names are sentences that describe behaviour, not implementation: "Clicking a mesh trust opens the summary slideout", not "Test click handler".

## Process

1. **Look for sibling feature files** under `features/` in the package under test. If found, read the closest one in full and use it as your template.
2. **If `features/` is empty or missing, ask the user** where existing feature files live. Only fall through to the greenfield template if the user confirms there are no siblings anywhere in the project.
3. **Find the project's mock package** (the package providing `dependencies` and `fs` to `setupSteps`). Note its mock-source directory and its typed env list — you'll need both.
4. **Identify the routes the page hits.** Confirm each one has a generator in the mock package. If any are unmocked, stop and report — that's a job for the project's mock layer, not the feature file.
5. **Inventory the `data-testid` attributes** the page renders by grepping the app source. These become your selector aliases.
6. **Decide the file path** under `features/<area>/<Name>.feature` mirroring the URL structure.
7. **Write the `Background`**: selector aliases first, then default environment, then any shared `responds with` overrides.
8. **Write each scenario** using only the steps in this document. Use `Scenario Outline` only when you have ≥2 examples that differ by parameter.
9. **Verify by reading**: every selector inside the scenarios should either be a `$alias` or a one-off `[data-testid='...']`; every step should match a row in the step vocabulary tables above.
10. **Report gaps**: if you couldn't write something because a step was missing, a route was unmocked, an env key didn't exist, or a default fixture conflicts with your assertion, write that in your final message — don't patch around it.
